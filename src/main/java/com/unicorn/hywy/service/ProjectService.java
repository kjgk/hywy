//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package com.unicorn.hywy.service;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.unicorn.hywy.model.po.Pact;
import com.unicorn.hywy.model.po.Project;
import com.unicorn.hywy.model.po.QPact;
import com.unicorn.hywy.model.po.QProject;
import com.unicorn.hywy.model.vo.BasicInfo;
import com.unicorn.hywy.model.vo.ProjectInfo;
import com.unicorn.hywy.repository.PactRepository;
import com.unicorn.hywy.repository.ProjectRepository;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@Transactional
public class ProjectService {
    private final PactRepository pactRepository;
    private final ProjectRepository projectRepository;
    private final JdbcTemplate jdbcTemplate;

    ProjectService(JdbcTemplate jdbcTemplate, ProjectRepository projectRepository, PactRepository pactRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.projectRepository = projectRepository;
        this.pactRepository = pactRepository;
    }

    public List<BasicInfo> getAccCode() {
        List<Map<String, Object>> list = this.jdbcTemplate.queryForList("select acc_no, acc_name from acc_code order by acc_no");
        return (List)list.stream().map((data) -> {
            return BasicInfo.valueOf((String)data.get("acc_no"), (String)data.get("acc_name"));
        }).collect(Collectors.toList());
    }

    public Page<ProjectInfo> queryProjectInfo(String keyword, Pageable page) {
        BooleanExpression expression = QProject.project.status.eq('0');
        if (!StringUtils.isEmpty(keyword)) {
            expression = expression.and(QProject.project.name.containsIgnoreCase(keyword));
        }

        Page<Project> projectPage = this.projectRepository.findAll(expression, page);
        List<ProjectInfo> contents = new ArrayList();
        projectPage.forEach((project) -> {
            ProjectInfo projectInfo = new ProjectInfo();
            projectInfo.setProjectId(project.getId());
            projectInfo.setProjectName(project.getName());
            Iterable<Pact> pacts = this.pactRepository.findAll(QPact.pact.type2.eq(project.getId()));
            int category1 = 0;
            int category2 = 0;
            int category3 = 0;
            int category4 = 0;
            int total = 0;

            for(Iterator var10 = pacts.iterator(); var10.hasNext(); ++total) {
                Pact pact = (Pact)var10.next();
                if ("00002".equals(pact.getAccCode())) {
                    ++category1;
                } else if ("00006".equals(pact.getAccCode())) {
                    ++category2;
                } else {
                    ++category3;
                }
            }

            projectInfo.setCategory1(category1);
            projectInfo.setCategory2(category2);
            projectInfo.setCategory3(category3);
            projectInfo.setCategory4(Integer.valueOf(category4));
            projectInfo.setTotal(total);
            contents.add(projectInfo);
        });
        return new PageImpl(contents, page, projectPage.getTotalElements());
    }

    public List<BasicInfo> list() {
        List<BasicInfo> result = new ArrayList();
        this.projectRepository.findAll(QProject.project.status.eq('0')).forEach((project) -> {
            result.add(BasicInfo.valueOf(project.getId().toString(), project.getName()));
        });
        return result;
    }

    public Project get(Long id) {
        return (Project)this.projectRepository.findById(id).orElseThrow(() -> {
            return new EntityNotFoundException(Project.class.getName() + "#" + id);
        });
    }
}
