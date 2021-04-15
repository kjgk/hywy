
package com.unicorn.hywy.controller;

import com.unicorn.hywy.model.po.Pact;
import com.unicorn.hywy.model.po.Project;
import com.unicorn.hywy.model.vo.BasicInfo;
import com.unicorn.hywy.model.vo.ProjectInfo;
import com.unicorn.hywy.service.PactService;
import com.unicorn.hywy.service.ProjectService;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.unicorn.hywy.controller.ApiNamespace.API_V1;

@RestController
@RequestMapping({API_V1 + "/project"})
public class ProjectController {
    private final ProjectService projectService;
    private final PactService pactService;

    ProjectController(ProjectService projectService, PactService pactService) {
        this.projectService = projectService;
        this.pactService = pactService;
    }

    @GetMapping
    Page<ProjectInfo> queryProjectInfo(Pageable page, String keyword) {
        return this.projectService.queryProjectInfo(keyword, page);
    }

    @GetMapping({"/{id}/pact"})
    Iterable<Pact> getPactList(@PathVariable Long id, String categoryId) {
        return this.pactService.getPactList(id, categoryId);
    }

    @GetMapping({"/list"})
    List<BasicInfo> list() {
        return this.projectService.list();
    }

    @GetMapping({"/{id}"})
    Project get(@PathVariable Long id) {
        return this.projectService.get(id);
    }

    @GetMapping({"/accCode"})
    List<BasicInfo> getAccCode() {
        return this.projectService.getAccCode();
    }
}
