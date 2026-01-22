package com.panda.ride.repository;

import com.panda.ride.model.AppRole;
import com.panda.ride.model.Driver;
import com.panda.ride.model.Ride;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Integer> {
	@Query("SELECT R FROM Ride R WHERE R.status=REQUESTED AND R.driver.id=:driverId")
	public List<Ride> getAllocatedRides(@Param("driverId") Integer driverId);
	
	@Query("SELECT R FROM Ride R where R.status=COMPLETED AND R.driver.Id=:driverId")
	public List<Ride> getCompletedRides(@Param("driverId")Integer driverId);

    boolean existsByUserName(String driver);

	Optional<Driver> findByUserName(String driver1);

	Optional<Driver> findByUserNameOrEmail(String usernameOrEmail, String usernameOrEmail1);

	Optional<Driver> findByEmail(String email);

	Page<Driver> findByRoles_RoleName(AppRole appRole, Pageable pageable);

}
