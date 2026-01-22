package com.panda.ride.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Driver driver;

    private Date startTime;

    private Date endTime;

    private double startLat;

    private double startLong;

    private double endLat;

    private double endLong;

    private double distance;

    private double fare;

    @Override
    public String toString() {
        return "Trip [id=" + id + ", user=" + user + ", driver=" + driver + ", startTime=" + startTime
                + ", endTime=" + endTime + ", startLat=" + startLat + ", startLong=" + startLong + ", endLat="
                + endLat + ", endLong=" + endLong + ", distance=" + distance + ", fare=" + fare + "]";
    }

}



