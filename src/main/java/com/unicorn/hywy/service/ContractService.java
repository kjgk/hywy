package com.unicorn.hywy.service;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.unicorn.hywy.exception.ServiceException;
import com.unicorn.hywy.model.po.*;
import com.unicorn.hywy.model.vo.*;
import com.unicorn.hywy.repository.*;
import com.unicorn.hywy.utils.SnowflakeIdWorker;
import org.apache.commons.io.FileUtils;
import org.springframework.data.domain.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContractService {

    private final PactRepository pactRepository;

    private final PactSerialRepository pactSerialRepository;

    private final PaymentRepository paymentRepository;

    private final ProjectRepository projectRepository;

    private final CompanyRepository companyRepository;

    private final PactAttachRepository pactAttachRepository;

    private final EnvironmentService environmentService;

    private final AttachmentService attachmentService;

    private final JdbcTemplate jdbcTemplate;

    private final SnowflakeIdWorker idWorker;

    ContractService(
            JdbcTemplate jdbcTemplate
            , SnowflakeIdWorker idWorker
            , ProjectRepository projectRepository
            , CompanyRepository companyRepository
            , PactRepository pactRepository
            , PactSerialRepository pactSerialRepository
            , PaymentRepository paymentRepository
            , PactAttachRepository pactAttachRepository
            , EnvironmentService environmentService
            , AttachmentService attachmentService
    ) {
        this.idWorker = idWorker;
        this.jdbcTemplate = jdbcTemplate;
        this.projectRepository = projectRepository;
        this.companyRepository = companyRepository;
        this.pactRepository = pactRepository;
        this.pactSerialRepository = pactSerialRepository;
        this.paymentRepository = paymentRepository;
        this.pactAttachRepository = pactAttachRepository;
        this.environmentService = environmentService;
        this.attachmentService = attachmentService;
    }

    /**
     * 新增合同
     */
    public Pact createPact(Pact pact) {

        pact.setPactNo(idWorker.nextId());
        pact.setPactNumber(pact.getType2() + "-" + pact.getType1() + "-" + getNextPactSerialNo());
        if (!StringUtils.isEmpty(pact.getCompA())) {
            pact.setSignA(getCompany(pact.getCompA()).getName());
        }
        if (!StringUtils.isEmpty(pact.getCompB())) {
            pact.setSignB(getCompany(pact.getCompB()).getName());
        }
        if (!StringUtils.isEmpty(pact.getCompC())) {
            pact.setSignC(getCompany(pact.getCompC()).getName());
        }
        if (!StringUtils.isEmpty(pact.getCompD())) {
            pact.setSignD(getCompany(pact.getCompD()).getName());
        }

        // 校验合同编号是否重复
        if (pactRepository.exists(QPact.pact.serialNo.eq(pact.getSerialNo()))) {
            throw new ServiceException("合同编号已经存在！");
        }
        return pactRepository.save(pact);
    }

    public Pact updatePact(Pact pact) {

        return pactRepository.findById(pact.getPactNo())
                .map(current -> {
                    current.setName(pact.getName());
                    current.setSerialNo(pact.getSerialNo());
                    current.setSerialCode(pact.getSerialCode());
                    current.setSignDate(pact.getSignDate());
                    current.setSignDate2(pact.getSignDate2());
                    current.setSignDate3(pact.getSignDate3());
                    current.setTransactor1(pact.getTransactor1());
                    current.setTransactor2(pact.getTransactor2());
                    current.setExecState(pact.getExecState());
                    current.setSubject(pact.getSubject());
                    current.setRemark(pact.getRemark());
                    current.setUpdateNote(pact.getUpdateNote());
                    current.setPayType(pact.getPayType());
                    current.setPayMode(pact.getPayMode());
                    current.setMonthPay(pact.getMonthPay());
                    current.setPayContent(pact.getPayContent());
                    current.setPrePercent(pact.getPrePercent());

                    // 校验合同编号是否重复
                    if (pactRepository.exists(QPact.pact.serialNo.eq(pact.getSerialNo())
                            .and(QPact.pact.pactNo.ne(pact.getPactNo()))
                    )) {
                        throw new ServiceException("合同编号已经存在！");
                    }

                    // 校验并更新付款信息
                    if (current.getPayType() == 0 || current.getPayMode() == 0) {
                        // 如果无收付款或者付款方式为实际使用式，则清空付款信息
                        current.setAuditSum(null);
                        current.setPactSum(null);
                        current.setBalance(null);
                    } else {
                        Double payTotal = getPactPayTotal(pact.getPactNo());
                        if (pact.getAuditSum() == null && payTotal != 0) {
                            throw new ServiceException("审核金额不能为空！");
                        }
                        if (pact.getAuditSum() != null && payTotal > pact.getAuditSum()) {
                            throw new ServiceException("审核金额不能小于已付金额！");
                        }
                        current.setPactSum(pact.getPactSum());
                        current.setAuditSum(pact.getAuditSum());
                        current.setBalance(pact.getAuditSum() - payTotal);
                    }

                    // 更新甲乙丙丁方
                    if (!current.getCompA().equals(pact.getCompA())) {
                        current.setCompA(pact.getCompA());
                        current.setSignA(getCompany(pact.getCompA()).getName());
                    }
                    if (!current.getCompB().equals(pact.getCompB())) {
                        current.setCompB(pact.getCompB());
                        current.setSignB(getCompany(pact.getCompB()).getName());
                    }
                    if (pact.getCompC() == null) {
                        current.setCompC(null);
                        current.setSignC(null);
                    } else {
                        if (current.getCompC() == null || !current.getCompC().equals(pact.getCompC())) {
                            current.setCompC(pact.getCompC());
                            current.setSignC(getCompany(pact.getCompC()).getName());
                        }
                    }
                    if (pact.getCompD() == null) {
                        current.setCompD(null);
                        current.setSignD(null);
                    } else {
                        if (current.getCompD() == null || !current.getCompD().equals(pact.getCompD())) {
                            current.setCompD(pact.getCompD());
                            current.setSignD(getCompany(pact.getCompD()).getName());
                        }
                    }
                    return pactRepository.save(current);
                })
                .orElse(null);
    }

    public void removePact(Long id) {

        // todo

        // pactRepository.deleteById(id);
    }

    public PactInfo getPactInfo(Long id) {

        Pact pact = getPact(id);
        PactInfo pactInfo = new PactInfo();
        pactInfo.setPactNo(pact.getPactNo());
        pactInfo.setSerialNo(pact.getSerialNo());
        pactInfo.setSerialCode(pact.getSerialCode());
        pactInfo.setPactNumber(pact.getPactNumber());
        pactInfo.setAuditSum(pact.getAuditSum());
        pactInfo.setPactSum(pact.getPactSum());
        pactInfo.setBalance(pact.getBalance());
        pactInfo.setName(pact.getName());
        pactInfo.setSubject(pact.getSubject());
        pactInfo.setRemark(pact.getRemark());
        pactInfo.setUpdateNote(pact.getUpdateNote());
        pactInfo.setPayType(pact.getPayType());
        pactInfo.setPayMode(pact.getPayMode());
        pactInfo.setSignA(pact.getSignA());
        pactInfo.setSignB(pact.getSignB());
        pactInfo.setSignD(pact.getSignC());
        pactInfo.setSignD(pact.getSignD());
        pactInfo.setSignDate(pact.getSignDate());
        pactInfo.setSignDate2(pact.getSignDate2());
        pactInfo.setSignDate3(pact.getSignDate3());
        pactInfo.setExecState(pact.getExecState());
        pactInfo.setTransactor1(pact.getTransactor1());
        pactInfo.setTransactor2(pact.getTransactor2());
        pactInfo.setCategoryNo(pact.getType1());
        pactInfo.setProjectNo(pact.getType2());
        pactInfo.setProjectName(getProject(pact.getType2()).getName());
        return pactInfo;
    }

    public PaymentInfo getPaymentInfo(Long id) {

        Payment payment = getPayment(id);
        PactInfo pactInfo = getPactInfo(payment.getPactNo());
        PaymentInfo paymentInfo = new PaymentInfo();
        paymentInfo.setPactNo(pactInfo.getPactNo());
        paymentInfo.setSerialNo(pactInfo.getSerialNo());
        paymentInfo.setPactNumber(pactInfo.getPactNumber());
        paymentInfo.setPactName(pactInfo.getName());
        paymentInfo.setProjectName(pactInfo.getProjectName());
        paymentInfo.setSignA(pactInfo.getSignA());
        paymentInfo.setSignB(pactInfo.getSignB());
        paymentInfo.setSignC(pactInfo.getSignC());
        paymentInfo.setSignD(pactInfo.getSignD());
        paymentInfo.setAuditSum(pactInfo.getAuditSum());
        paymentInfo.setPactSum(pactInfo.getPactSum());
        paymentInfo.setBalance(pactInfo.getBalance());
        paymentInfo.setPayCount(payment.getPayCount());
        paymentInfo.setPayDate(payment.getPayDate());
        paymentInfo.setWarrant(payment.getWarrant());
        paymentInfo.setRemark(payment.getRemark());
        return paymentInfo;
    }

    /**
     * 获取合同递增序列号
     */
    private String getNextPactSerialNo() {

        PactSerial current = pactSerialRepository.findById(1L)
                .orElseGet(() -> {
                    PactSerial pactSerial = new PactSerial();
                    pactSerial.setId(1L);
                    pactSerial.setCurrentNo(0L);
                    return pactSerialRepository.save(pactSerial);
                });
        current.setCurrentNo(current.getCurrentNo() + 1);
        return String.format("%04d", current.getCurrentNo());
    }

    /**
     * 新增付款信息
     */
    public Payment createPayment(Payment payment) {

        payment.setPayNo(idWorker.nextId());
        Payment current = paymentRepository.save(payment);
        Pact pact = getPact(current.getPactNo());

        if (pact.getPayType() == 0 || pact.getPayMode() == 0) {
            return current;
        }

        // 当前已经存在的付款
        Double payTotal = getPactPayTotal(payment.getPactNo());
        pact.setBalance(pact.getAuditSum() - payTotal - (current.getPayType() == 1 ? 1 : -1) * current.getPayCount());
        if (pact.getBalance() < 0) {
            throw new ServiceException("付款金额不能超过余额！");
        }
        return current;
    }

    public Payment updatePayment(Payment payment) {

        return paymentRepository.findById(payment.getPayNo())
                .map(current -> {
                    Double currentPayCount = (current.getPayType() == 1 ? 1 : -1) * current.getPayCount();
                    current.setPayCount(payment.getPayCount());
                    current.setInvCount(payment.getInvCount());
                    current.setPayDate(payment.getPayDate());
                    current.setRemark(payment.getRemark());
                    current.setWarrant(payment.getWarrant());
                    current.setPayType(payment.getPayType());
                    Pact pact = getPact(current.getPactNo());
                    if (pact.getPayType() == 0 || pact.getPayMode() == 0) {
                        return current;
                    }

                    pact.setBalance(pact.getBalance() + (currentPayCount - (current.getPayType() == 1 ? 1 : -1) * current.getPayCount()));
                    if (pact.getBalance() < 0) {
                        throw new ServiceException("付款金额不能超过余额！");
                    }
                    return paymentRepository.save(current);
                })
                .orElse(null);
    }

    public void removePayment(Long id) {

        Payment payment = paymentRepository.findById(id).orElse(null);
        if (payment != null) {
            Pact pact = getPact(payment.getPactNo());
            pact.setBalance(pact.getBalance() + (payment.getPayType() == 1 ? 1 : -1) * payment.getPayCount());
            paymentRepository.delete(payment);
        }
    }

    public Page<Payment> queryPayment(Long pactNo, Pageable page) {

        return paymentRepository.findAll(QPayment.payment.pactNo.eq(pactNo)
                , PageRequest.of(page.getPageNumber(), page.getPageSize(), new Sort(Sort.Direction.ASC, "payDate")));
    }

    /**
     * 新增附件
     */
    public void createPactAttaches(PactAttaches pactAttaches) {

        for (FileUploadInfo fileUploadInfo : pactAttaches.getFileList()) {
            String uploadFilename = "/pact" + "/" + String.valueOf(idWorker.nextId());
            File file = new File(environmentService.getTempPath() + "/" + fileUploadInfo.getTempFilename());
            try {
                FileUtils.copyFile(file, new File(environmentService.getUploadPath() + uploadFilename));
            } catch (Exception e) {
                e.printStackTrace();
            }

            PactAttach pactAttach = new PactAttach();
            pactAttach.setAttachNo(idWorker.nextId());
            pactAttach.setPactNo(pactAttaches.getPactNo());
            pactAttach.setUploadFilename(uploadFilename);
            pactAttach.setFilename(fileUploadInfo.getFilename());
            pactAttach.setStatus('1');
            pactAttach.setUploadTime(new Date());
            pactAttachRepository.save(pactAttach);
        }
    }

    public void removePactAttach(Long id) {

        pactAttachRepository.findById(id)
                .map(current -> {
                    current.setStatus('0');
                    return pactAttachRepository.save(current);
                })
                .orElse(null);
    }

    public Page<PactAttach> queryPactAttach(Long pactNo, Pageable page) {

        Page<PactAttach> result = pactAttachRepository.findAll(QPactAttach.pactAttach.pactNo.eq(pactNo)
                        .and(QPactAttach.pactAttach.status.eq('1'))
                , PageRequest.of(page.getPageNumber(), page.getPageSize(), new Sort(Sort.Direction.ASC, "attachNo")));
        result.forEach(pactAttach -> pactAttach.setLink(attachmentService.buildDownloadUrl(pactAttach.getUploadFilename())));
        return result;
    }


    /**
     * 获取项目类别
     */
    public List<BasicInfo> getAccCode() {

        List<Map<String, Object>> list = jdbcTemplate.queryForList("select acc_no, acc_name from acc_code order by acc_no");
        return list.stream().map(data -> BasicInfo.valueOf((String) data.get("acc_no"), (String) data.get("acc_name")))
                .collect(Collectors.toList());
    }

    public Page<ContractInfo> queryContractInfo(String keyword, Pageable page) {

        BooleanExpression expression = QProject.project.status.eq('0');
        if (!StringUtils.isEmpty(keyword)) {
            expression = expression.and(QProject.project.name.containsIgnoreCase(keyword));
        }
        Page<Project> projectPage = projectRepository.findAll(expression, page);
        List<ContractInfo> contents = new ArrayList();
        projectPage.forEach(project -> {
            ContractInfo contractInfo = new ContractInfo();
            contractInfo.setProjectId(project.getId());
            contractInfo.setProjectName(project.getName());
            Iterable<Pact> pacts = pactRepository.findAll(QPact.pact.type2.eq(project.getId()));
            int category1 = 0;
            int category2 = 0;
            int category3 = 0;
            int category4 = 0;
            int total = 0;
            for (Pact pact : pacts) {
                if ("00002".equals(pact.getAccCode())) {
                    category1++;
                } else if ("00006".equals(pact.getAccCode())) {
                    category2++;
                } else {
                    category3++;
                }
                total++;
            }
            contractInfo.setCategory1(category1);
            contractInfo.setCategory2(category2);
            contractInfo.setCategory3(category3);
            contractInfo.setCategory4(category4);
            contractInfo.setTotal(total);
            contents.add(contractInfo);
        });
        return new PageImpl(contents, page, projectPage.getTotalElements());
    }

    // todo 分页查询
    public Iterable<Pact> getPactList(Long projectId, String categoryId) {

        QPact pact = QPact.pact;
        BooleanExpression expression = pact.type2.eq(projectId);
        if (!StringUtils.isEmpty(categoryId)) {
            expression = expression.and(pact.type1.eq(categoryId));
        }
        return pactRepository.findAll(expression);
    }

    private Double getPactPayTotal(Long pactNo) {

        Double total1 = jdbcTemplate.queryForObject("select sum(pay_count) from payment where pay_type = ? and pact_no = ?", Double.class, 1, pactNo);
        Double total2 = jdbcTemplate.queryForObject("select sum(pay_count) from payment where pay_type = ? and pact_no = ?", Double.class, 2, pactNo);
        total1 = total1 == null ? 0 : total1;
        total2 = total2 == null ? 0 : total2;
        return total1 - total2;
    }

    public Payment getPayment(Long id) {

        return paymentRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(Payment.class.getName() + "#" + id));
    }

    public Pact getPact(Long id) {

        return pactRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(Pact.class.getName() + "#" + id));
    }

    public Company getCompany(Long id) {
        return companyRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(Company.class.getName() + "#" + id));
    }

    public Project getProject(Long id) {
        return projectRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(Project.class.getName() + "#" + id));
    }


}
