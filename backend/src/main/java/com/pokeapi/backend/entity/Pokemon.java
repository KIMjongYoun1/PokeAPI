package com.pokeapi.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.util.Date;


@Entity
@Table(name = "pokemon")
@Getter
@Setter
@ToString(exclude = {"createdAt", "updatedAt"})
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
@AllArgsConstructor
public class Pokemon {
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pokemon_id", unique = true, nullable = false)
    private Integer pokemonId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "base_experience", nullable = false)
    private Integer baseExperience;

    @Column(name = "height")
    private Integer height;

    @Column(name = "weight")
    private Integer weight;

    @Column(name = "sprite_url", nullable = false)
    private String spriteUrl;

    @Column(name = "shiny_sprite_url", nullable = false)
    private String shinySpriteUrl;

    @Column(name = "official_artwork_url")
    private String officialArtworkUrl;

    @Column(name = "types", columnDefinition = "TEXT")
    private String types;

    @Column(name = "stats", columnDefinition = "TEXT")
    private String state;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "abilities", columnDefinition = "TEXT")
    private String abilities;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        updatedAt = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
    
}
