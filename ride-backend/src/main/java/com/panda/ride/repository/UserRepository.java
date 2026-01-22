package com.panda.ride.repository;

import com.panda.ride.model.AppRole;
import com.panda.ride.model.Ride;
import com.panda.ride.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

	@Query("SELECT R FROM Ride R where R.status=COMPLETED AND R.user.Id=:userId ORDER BY R.endTime DESC")
	public List<Ride> getCompletedRides(@Param("userId")Integer userId);

	Optional<User> findByUserName(String username);

    boolean existsByUserName(String username);

	boolean existsByEmail(@NotBlank(message= "Email is Required") @Email(message = "Email should be valid") String email);

	@Query("SELECT u FROM User u JOIN u.roles r WHERE r.roleName = :role")
	Page<User> findByRoleName(@Param("role") AppRole appRole, Pageable pageable);

	Optional<User> findByUserNameOrEmail(String usernameOrEmail, String usernameOrEmail1);

	Optional<User> findByEmail(String email);
}

