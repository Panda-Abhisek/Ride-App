package com.panda.ride.repository;

import com.panda.ride.model.License;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LicenseRepository extends JpaRepository<License, Integer> {

}
