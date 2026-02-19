1. Create a spring-boot initial setup file using the following settings:
### Project Settings
* Project : Maven
* Language : Java
* Artifact : <application name>
* Name : <application name>
* Packaging : Jar

2. Make sure to add `spring-boot-starter-web` and `spring-boot-maven-plugin` dependency to keep the session alive.

3. run `mvn spring-boot:run` to start the server

4. Createl SessionState and SessionType enums.

5. Started with a skeleton of PomodoroSession class.

  * Outline how the variables are initialized with getters and setters for all.

  * Next plan how the fields are allowed to change.

  * Make sure the check the validity of how the fields are changing.

  * Use public functions to expose the behavior. 

6. A Barebones class called PomodoroController which would deal with api endpoints.

7. Send a request using the browser to test the end point.

```
  fetch("http://localhost:8080/api/pomodoro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      startTime: "2026-01-30T18:00:00",
      endTime: "2026-01-30T18:25:00",
      type: "WORK"
    })
  })
  .then(res => res.json())
  .then(data => console.log("Response:", data))
  .catch(err => console.error(err));
```

* NOTE: You needn't make the fields final as hibernate JPA would be injecting values later and instantiates it without knowing it's state

8. To connect to github use the following command `git remote add origin <Github-SSH-URL>` and  `git push origin main`

9. Create PomodoroService essentially the brain of this app, which manages the states of Session and checks what is valid and what is invalid.

  * Expose public objects that gets, starts, completes, pauses, resumes, and cancels the sessions and returns the object when completed successfully.

  * Start with simple error management which throws errors when there is an illegal state.

10. Map the api's with the respective exposed PomodoroService in PomodoroController.