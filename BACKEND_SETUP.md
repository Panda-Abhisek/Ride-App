# Ride App - README

## Backend Setup

## Project overview
Minimal Spring Boot application providing admin endpoints to list riders, drivers, and rides. Uses Maven and Lombok. Key controllers and DTOs are under `src/main/java/com/panda/ride`.

## Prerequisites
- Java 17+ (or the project's configured Java version)
- Maven 3.6+
- Git
- (Optional) PostgreSQL or other relational DB if not using an in-memory DB

## Import into IntelliJ IDEA
1. Open IntelliJ IDEA 2025.3.1.1.
2. Choose *Open* and select the project root (the folder containing `pom.xml`).
3. Wait for Maven and Lombok to import. Enable annotation processing:  
   `File > Settings > Build, Execution, Deployment > Compiler > Annotation Processors > Enable annotation processing`.

## Configuration
Application configuration is in `src/main/resources/application.properties` or `application.yml`. Example properties:

- PostgreSQL example:
- spring.datasource.url=jdbc:postgresql://localhost:5432/ridedb
- spring.datasource.username= PUT_YOUR_USERNAME
- spring.datasource.password= PUT_YOUR_PASSWORD
- spring.jpa.hibernate.ddl-auto=update
- spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

- server.port=8080

You can also use environment variables:
- `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `SPRING_PROFILES_ACTIVE`.

## Build & run (terminal)
- Build: `mvn clean package -DskipTests`
- Run via Maven: `mvn spring-boot:run`
- Run JAR: `java -jar target/<artifactId>-<version>.jar`

## Run in IntelliJ
- Run the main application class (annotated with `@SpringBootApplication`) using the Run/Debug configuration created by IntelliJ.
- Use breakpoints and the IDE debugger as needed.

## API Endpoints
Controller base path: `/api/admins`

- GET `/api/admins/get/riders`  
  Response: list of `UserDTO` (riders)

- GET `/api/admins/get/drivers`  
  Response: list of `DriverDTO`

- GET `/api/admins/get/rides`  
  Response: list of `RideDTO`

Example curl:
  curl -X GET http://localhost:8080/api/admins/get/riders 
  curl -X GET http://localhost:8080/api/admins/get/drivers 
  curl -X GET http://localhost:8080/api/admins/get/rides

## Tests
- Run unit tests: `mvn test`
- Use IntelliJ to run/debug individual tests or test classes.

## Common Maven commands
- `mvn clean`
- `mvn verify`
- `mvn dependency:tree` (inspect dependencies)
- `mvn -DskipTests=true package` (package without tests)

## Troubleshooting
- Lombok issues: ensure annotation processing is enabled in IntelliJ.
- Database connection errors: confirm `spring.datasource.*` properties and database availability.
- Port conflicts: change `server.port` in properties or export `SERVER_PORT` env var.

## Notes
- Services referenced by controllers: `UserService`, `DriverService`, `RideService`. DTOs used: `UserDTO`, `DriverDTO`, `RideDTO`.
- Typical dependencies: `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `lombok`, a JDBC driver (H2/Postgres), and `spring-boot-starter-test` for tests.

Save this file as `README.md` in the project root.


## Frontedn Setup
