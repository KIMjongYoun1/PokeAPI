package com.pokeapi.backend.dto;

import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

/** 
 * 포켓몬 종 정보 DTO
 * 진화 체인에서 사용되는 포켓몬 종의 기본 정보
 * 
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResourceDTO {

    @JsonProperty("name")
    private String name;

    @JsonProperty("url")
    private String url;

  
}