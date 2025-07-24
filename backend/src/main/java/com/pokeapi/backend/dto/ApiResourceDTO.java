package com.pokeapi.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/** 
 * 포켓몬 종 정보 DTO
 * 진화 체인에서 사용되는 포켓몬 종의 기본 정보
 * 
 */
public class ApiResourceDTO {

    @JsonProperty("name")
    private String name;

    @JsonProperty("url")
    private String url;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}