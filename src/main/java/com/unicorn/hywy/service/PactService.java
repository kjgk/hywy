package com.unicorn.hywy.service;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.unicorn.hywy.exception.ServiceException;
import com.unicorn.hywy.model.po.Company;
import com.unicorn.hywy.model.po.Pact;
import com.unicorn.hywy.model.po.PactAttach;
import com.unicorn.hywy.model.po.PactSerial;
import com.unicorn.hywy.model.po.Payment;
import com.unicorn.hywy.model.po.Project;
import com.unicorn.hywy.model.po.QPact;
import com.unicorn.hywy.model.po.QPactAttach;
import com.unicorn.hywy.model.po.QPayment;
import com.unicorn.hywy.model.vo.FileUploadInfo;
import com.unicorn.hywy.model.vo.PactAttaches;
import com.unicorn.hywy.model.vo.PactInfo;
import com.unicorn.hywy.model.vo.PaymentInfo;
import com.unicorn.hywy.model.vo.PactInfo.PaymentTotal;
import com.unicorn.hywy.repository.CompanyRepository;
import com.unicorn.hywy.repository.PactAttachRepository;
import com.unicorn.hywy.repository.PactRepository;
import com.unicorn.hywy.repository.PactSerialRepository;
import com.unicorn.hywy.repository.PaymentRepository;
import com.unicorn.hywy.repository.ProjectRepository;
import com.unicorn.hywy.utils.SnowflakeIdWorker;
import java.io.File;
import java.math.BigDecimal;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;
import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import org.apache.commons.io.FileUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@Transactional
public class PactService {
    private final PactRepository pactRepository;
    private final PactSerialRepository pactSerialRepository;
    private final PaymentRepository paymentRepository;
    private final ProjectRepository projectRepository;
    private final CompanyRepository companyRepository;
    private final PactAttachRepository pactAttachRepository;
    private final EnvironmentService environmentService;
    private final JdbcTemplate jdbcTemplate;
    private final SnowflakeIdWorker idWorker;

    PactService(JdbcTemplate jdbcTemplate, SnowflakeIdWorker idWorker, ProjectRepository projectRepository, CompanyRepository companyRepository, PactRepository pactRepository, PactSerialRepository pactSerialRepository, PaymentRepository paymentRepository, PactAttachRepository pactAttachRepository, EnvironmentService environmentService) {
        this.idWorker = idWorker;
        this.jdbcTemplate = jdbcTemplate;
        this.projectRepository = projectRepository;
        this.companyRepository = companyRepository;
        this.pactRepository = pactRepository;
        this.pactSerialRepository = pactSerialRepository;
        this.paymentRepository = paymentRepository;
        this.pactAttachRepository = pactAttachRepository;
        this.environmentService = environmentService;
    }

    public Page<PactInfo> queryPactInfo(String keyword, Long projectId, Integer execState, Pageable page) {
        QPact pact = QPact.pact;
        BooleanExpression expression = pact.isNotNull();
        if (!StringUtils.isEmpty(keyword)) {
            String[] var7 = keyword.split(" ");
            int var8 = var7.length;

            for(int var9 = 0; var9 < var8; ++var9) {
                String s = var7[var9];
                if (!StringUtils.isEmpty(s)) {
                    expression = expression.and(pact.name.containsIgnoreCase(s).or(pact.pactNumber.containsIgnoreCase(s)).or(pact.serialNo.containsIgnoreCase(s)).or(pact.serialCode.containsIgnoreCase(s)).or(pact.signA.containsIgnoreCase(s)).or(pact.signB.containsIgnoreCase(s)).or(pact.signC.containsIgnoreCase(s)).or(pact.signD.containsIgnoreCase(s)));
                }
            }
        }

        if (projectId != null) {
            expression = expression.and(pact.type2.eq(projectId));
        }

        if (execState != null) {
            expression = expression.and(pact.execState.eq(execState));
        }

        return this.pactRepository.findAll(expression, page).map((pact1) -> this.buildPactInfo(pact1, false));
    }

    public Pact createPact(Pact pact) {
        pact.setPactNo(this.idWorker.nextId());
        pact.setPactNumber(pact.getType2() + "-" + pact.getType1() + "-" + this.getNextPactSerialNo());
        if (!StringUtils.isEmpty(pact.getCompA())) {
            pact.setSignA(this.getCompany(pact.getCompA()).getName());
        }

        if (!StringUtils.isEmpty(pact.getCompB())) {
            pact.setSignB(this.getCompany(pact.getCompB()).getName());
        }

        if (!StringUtils.isEmpty(pact.getCompC())) {
            pact.setSignC(this.getCompany(pact.getCompC()).getName());
        }

        if (!StringUtils.isEmpty(pact.getCompD())) {
            pact.setSignD(this.getCompany(pact.getCompD()).getName());
        }

        if (this.pactRepository.exists(QPact.pact.serialNo.eq(pact.getSerialNo()))) {
            throw new ServiceException("合同编号已经存在！");
        } else {
            return this.pactRepository.save(pact);
        }
    }

    public Pact updatePact(Pact pact) {
        return this.pactRepository.findById(pact.getPactNo()).map((current) -> {
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
            if (this.pactRepository.exists(QPact.pact.serialNo.eq(pact.getSerialNo()).and(QPact.pact.pactNo.ne(pact.getPactNo())))) {
                throw new ServiceException("合同编号已经存在！");
            } else {
                if (current.getPayType() != 0 && current.getPayMode() != 0) {
                    Double payTotal = this.getPactPayTotal(pact.getPactNo());
                    if (pact.getAuditSum() == null && payTotal != 0.0D) {
                        throw new ServiceException("审核金额不能为空！");
                    }

                    if (pact.getAuditSum() != null && payTotal > pact.getAuditSum()) {
                        throw new ServiceException("审核金额不能小于已付金额！");
                    }

                    current.setPactSum(pact.getPactSum());
                    current.setAuditSum(pact.getAuditSum());
                    current.setBalance(pact.getAuditSum() - payTotal);
                } else {
                    current.setAuditSum(null);
                    current.setPactSum(null);
                    current.setBalance(null);
                }

                if (!current.getCompA().equals(pact.getCompA())) {
                    current.setCompA(pact.getCompA());
                    current.setSignA(this.getCompany(pact.getCompA()).getName());
                }

                if (!current.getCompB().equals(pact.getCompB())) {
                    current.setCompB(pact.getCompB());
                    current.setSignB(this.getCompany(pact.getCompB()).getName());
                }

                if (pact.getCompC() == null) {
                    current.setCompC(null);
                    current.setSignC(null);
                } else if (current.getCompC() == null || !current.getCompC().equals(pact.getCompC())) {
                    current.setCompC(pact.getCompC());
                    current.setSignC(this.getCompany(pact.getCompC()).getName());
                }

                if (pact.getCompD() == null) {
                    current.setCompD(null);
                    current.setSignD(null);
                } else if (current.getCompD() == null || !current.getCompD().equals(pact.getCompD())) {
                    current.setCompD(pact.getCompD());
                    current.setSignD(this.getCompany(pact.getCompD()).getName());
                }

                return this.pactRepository.save(current);
            }
        }).orElse(null);
    }

    public void removePact(Long id) {
    }

    public PactInfo getPactInfo(Long id, boolean payments) {
        Pact pact = this.getPact(id);
        return this.buildPactInfo(pact, payments);
    }

    public PaymentInfo getPaymentInfo(Long id) {
        Payment payment = this.getPayment(id);
        return this.buildPaymentInfo(payment);
    }

    private PactInfo buildPactInfo(Pact pact, boolean payments) {
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
        pactInfo.setProjectName(this.getProject(pact.getType2()).getName());
        pactInfo.setMonthPay(pact.getMonthPay());
        pactInfo.setPayContent(pact.getPayContent());
        pactInfo.setPrePercent(pact.getPrePercent());
        if (payments) {
            pactInfo.setPayments(this.jdbcTemplate.queryForList("select DATE_FORMAT(PAY_DATE, '%Y') year,\nsum(case PAY_TYPE when 1 then PAY_COUNT when 2 then -PAY_COUNT end) total \nfrom payment\nwhere pact_no = ?\ngroup by DATE_FORMAT(PAY_DATE, '%Y')\norder by DATE_FORMAT(PAY_DATE, '%Y')", new Object[]{pact.getPactNo()}).stream().map((data) -> {
                return new PaymentTotal((String)data.get("year"), ((BigDecimal)data.get("total")).doubleValue());
            }).collect(Collectors.toList()));
        }

        return pactInfo;
    }

    private PaymentInfo buildPaymentInfo(Payment payment) {
        PactInfo pactInfo = this.getPactInfo(payment.getPactNo(), false);
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
        paymentInfo.setPayType(payment.getPayType());
        paymentInfo.setPayCount(payment.getPayCount());
        paymentInfo.setPayDate(payment.getPayDate());
        paymentInfo.setWarrant(payment.getWarrant());
        paymentInfo.setRemark(payment.getRemark());
        paymentInfo.setCompany(payment.getCompany());
        List<Long> paymentList = jdbcTemplate.queryForList("select PAY_NO from payment where PACT_NO = ? order by PAY_NO", Long.class, payment.getPactNo());
        paymentInfo.setIndex(paymentList.indexOf(payment.getPayNo()));
        return paymentInfo;
    }

    private String getNextPactSerialNo() {
        PactSerial current = this.pactSerialRepository.findById(1L).orElseGet(() -> {
            PactSerial pactSerial = new PactSerial();
            pactSerial.setId(1L);
            pactSerial.setCurrentNo(0L);
            return this.pactSerialRepository.save(pactSerial);
        });
        current.setCurrentNo(current.getCurrentNo() + 1L);
        return String.format("%04d", current.getCurrentNo());
    }

    public Page<PactInfo> queryPaymentInfo(String keyword, Integer payType, Pageable page) {
        QPact pact = QPact.pact;
        BooleanExpression expression = pact.isNotNull();
        if (!StringUtils.isEmpty(keyword)) {
            String[] var6 = keyword.split(" ");
            int var7 = var6.length;

            for(int var8 = 0; var8 < var7; ++var8) {
                String s = var6[var8];
                if (!StringUtils.isEmpty(s)) {
                    expression = expression.and(pact.name.containsIgnoreCase(s).or(pact.pactNumber.containsIgnoreCase(s)).or(pact.serialNo.containsIgnoreCase(s)).or(pact.serialCode.containsIgnoreCase(s)).or(pact.signA.containsIgnoreCase(s)).or(pact.signB.containsIgnoreCase(s)).or(pact.signC.containsIgnoreCase(s)).or(pact.signD.containsIgnoreCase(s)));
                }
            }
        }

        if (payType == null) {
            expression = expression.and(pact.payType.in(new Integer[]{1, 2}));
        } else {
            expression = expression.and(pact.payType.eq(payType));
        }

        expression = expression.and(pact.payMode.ne(0));
        return this.pactRepository.findAll(expression, page).map((pact1) -> this.buildPactInfo(pact1, false));
    }

    public Iterable<Payment> getPaymentList(Long pactNo) {
        return this.paymentRepository.findAll(QPayment.payment.pactNo.eq(pactNo), new Sort(Direction.ASC, new String[]{"payNo"}));
    }

    public Payment createPayment(Payment payment) {
        payment.setPayNo(this.idWorker.nextId());
        Payment current = (Payment)this.paymentRepository.save(payment);
        Pact pact = this.getPact(current.getPactNo());
        if (pact.getPayType() != 0 && pact.getPayMode() != 0) {
            Double payTotal = this.getPactPayTotal(payment.getPactNo());
            pact.setBalance(pact.getAuditSum() - payTotal - (double)(current.getPayType() == 1 ? 1 : -1) * current.getPayCount());
            if (pact.getBalance() < 0.0D) {
                throw new ServiceException("付款金额不能超过余额！");
            } else {
                return current;
            }
        } else {
            return current;
        }
    }

    public Payment updatePayment(Payment payment) {
        return this.paymentRepository.findById(payment.getPayNo()).map((current) -> {
            Double currentPayCount = (double)(current.getPayType() == 1 ? 1 : -1) * current.getPayCount();
            current.setPayCount(payment.getPayCount());
            current.setInvCount(payment.getInvCount());
            current.setPayDate(payment.getPayDate());
            current.setRemark(payment.getRemark());
            current.setWarrant(payment.getWarrant());
            current.setPayType(payment.getPayType());
            current.setCompany(payment.getCompany());
            Pact pact = this.getPact(current.getPactNo());
            if (pact.getPayType() != 0 && pact.getPayMode() != 0) {
                pact.setBalance(pact.getBalance() + (currentPayCount - (double)(current.getPayType() == 1 ? 1 : -1) * current.getPayCount()));
                if (pact.getBalance() < 0.0D) {
                    throw new ServiceException("付款金额不能超过余额！");
                } else {
                    return this.paymentRepository.save(current);
                }
            } else {
                return current;
            }
        }).orElse(null);
    }

    public void removePayment(Long id) {
        Payment payment = this.paymentRepository.findById(id).orElse(null);
        if (payment != null) {
            Pact pact = this.getPact(payment.getPactNo());
            pact.setBalance(pact.getBalance() + (double)(payment.getPayType() == 1 ? 1 : -1) * payment.getPayCount());
            this.paymentRepository.delete(payment);
        }
    }

    public void createPactAttaches(PactAttaches pactAttaches) {
        Iterator var2 = pactAttaches.getFileList().iterator();

        while(var2.hasNext()) {
            FileUploadInfo fileUploadInfo = (FileUploadInfo)var2.next();
            String uploadFilename = "/pact/" + pactAttaches.getPactNo() + "/" + this.idWorker.nextId();
            File file = new File(this.environmentService.getTempPath() + "/" + fileUploadInfo.getTempFilename());

            try {
                FileUtils.copyFile(file, new File(this.environmentService.getUploadPath() + uploadFilename));
            } catch (Exception var7) {
                var7.printStackTrace();
            }

            PactAttach pactAttach = new PactAttach();
            pactAttach.setAttachNo(this.idWorker.nextId());
            pactAttach.setPactNo(pactAttaches.getPactNo());
            pactAttach.setUploadFilename(uploadFilename);
            pactAttach.setFilename(fileUploadInfo.getFilename());
            pactAttach.setStatus('1');
            pactAttach.setUploadTime(new Date());
            this.pactAttachRepository.save(pactAttach);
        }

    }

    public void removePactAttach(Long id) {
        this.pactAttachRepository.findById(id).map((current) -> {
            current.setStatus('0');
            return this.pactAttachRepository.save(current);
        }).orElse(null);
    }

    public PactAttach getPactAttach(Long id) {
        return this.pactAttachRepository.findById(id).orElse(null);
    }

    public Iterable<PactAttach> getPactAttachList(Long pactNo) {
        return this.pactAttachRepository.findAll(QPactAttach.pactAttach.pactNo.eq(pactNo).and(QPactAttach.pactAttach.status.eq('1')), new Sort(Direction.ASC, new String[]{"attachNo"}));
    }

    public Iterable<Pact> getPactList(Long projectId, String categoryId) {
        QPact pact = QPact.pact;
        BooleanExpression expression = pact.type2.eq(projectId);
        if (!StringUtils.isEmpty(categoryId)) {
            expression = expression.and(pact.type1.eq(categoryId));
        }

        return this.pactRepository.findAll(expression);
    }

    private Double getPactPayTotal(Long pactNo) {
        Double total1 = this.jdbcTemplate.queryForObject("select sum(pay_count) from payment where pay_type = ? and pact_no = ?", Double.class, new Object[]{1, pactNo});
        Double total2 = this.jdbcTemplate.queryForObject("select sum(pay_count) from payment where pay_type = ? and pact_no = ?", Double.class, new Object[]{2, pactNo});
        total1 = total1 == null ? 0.0D : total1;
        total2 = total2 == null ? 0.0D : total2;
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
