package com.unicorn.hywy.controller;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.unicorn.hywy.model.po.Project;
import com.unicorn.hywy.model.po.QProject;
import com.unicorn.hywy.model.vo.BasicInfo;
import com.unicorn.hywy.repository.ProjectRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;

import static com.unicorn.hywy.controller.ApiNamespace.API_V1;

@RestController
@RequestMapping(API_V1 + "/project")
public class ProjectController {

    private final ProjectRepository repository;

    ProjectController(ProjectRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    Page<Project> page(Pageable page, String keyword) {

        QProject project = QProject.project;
        BooleanExpression expression = project.isNotNull();
        if (!StringUtils.isEmpty(keyword)) {
            expression = expression.and(project.name.contains(keyword));
        }
        return repository.findAll(expression, page);
    }

    @GetMapping("/list")
    List<BasicInfo> list() {

        List<BasicInfo> result = new ArrayList();
        repository.findAll(QProject.project.status.eq('0')).forEach(project -> result.add(BasicInfo.valueOf(project.getId().toString(), project.getName())));
        return result;
    }


    @GetMapping("/{id}")
    Project get(@PathVariable Long id) {

        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException(Project.class.getName() + "#" + id));
    }

    @PostMapping
    Project create(@RequestBody Project project) {
        return repository.save(project);
    }

    @PatchMapping("/{id}")
    Project update(@RequestBody Project pro, @PathVariable Long id) {

        return repository.findById(id)
                .map(current -> {
                    current.setName(pro.getName());
                    current.setLogo(pro.getLogo());
                    current.setStatus(pro.getStatus());
                    return repository.save(current);
                })
                .orElse(null);
    }

    @DeleteMapping("/{id}")
    void remove(@PathVariable Long id) {
        repository.deleteById(id);
    }
}