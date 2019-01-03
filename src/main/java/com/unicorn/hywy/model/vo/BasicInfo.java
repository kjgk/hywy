package com.unicorn.hywy.model.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@Setter
@ToString
public class BasicInfo implements Serializable {

    protected String id;

    protected String name;

    protected BasicInfo(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public static BasicInfo valueOf(String id, String name) {
        return new BasicInfo(id, name);
    }
}
