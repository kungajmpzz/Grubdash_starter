# Home Schedule Manager

> Whether it’s roommates, family, friends, or anyone else, there’s a lot of schedules to manage to keep a house running smoothly! This application will allow users to create both one-off and recurring events and tasks that need to be completed, assign them to different members of the house, and mark them off as completed. This can be used for managing routine chores, dropping people off at appointments, and more.

There are no user stories for deployment: it is expected that you will deploy the application to production after you finish a user story.

There are no user stories for logging: it is expected that you will add logging to the application with enough detail to help you diagnose issues in production.

## Existing files

This repository is set up as a *monorepo*, meaning that the frontend and backend projects are in one repository. This allows you to open both projects in the same editor.

As you work through the user stories listed later in this document, you will be writing code that allows your frontend and backend applications to talk to each other. You will also write code to allow your controllers and services to connect to, and query, your PostgreSQL database via [Knex](http://knexjs.org/).

The table below describes the folders in this starter repository:

| Folder/file path | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `./back-end`     | The backend project, which runs on `localhost:5001` by default.  |
| `./front-end`    | The frontend project, which runs on `localhost:3000` by default. |

This starter code closely follows the best practices and patterns established in the Robust Server Structure module.

**Note**: Please do not submit a pull request to this repository with your solution.


## Project Requirements

### Database Schema

The database for this project has two main tables, `tasks` and `household_members`, with a join table for `assignments`. The schemas for each of these tables follows. These schemas should be set up using Knex migrations for each table.

#### `tasks` table

| column name | data type | description |
|-------------|-----------|-------------|
| `id` | `integer` | unique ID for each task |
| `title` | `text` | name for the task |
| `description` | `text` | longer description of the task |
| `due_date` | `date` | day when the task should be completed |
| `importance` | `varchar(10)` | one of `high`, `medium`, or `low` |
| `recurring` | `integer` | if `null`, the task does not recur; if a numeric value, it recurs every X days, where X is the value |
| `assignee` | `integer` | references `household_members` table; is nullable for if a task has not been assigned |
| `completed` | `boolean` | whether this task has been completed |

#### `household_members` table

You will design for yourself what the `household_members` table looks like. At minimum, it must include `id` and `member_name` fields.

### Seed Data

Your project must contain at least 4 tasks and 3 household members; you must have at least 2 assigned tasks and 2 unassigned tasks, and at least 1 completed task. Test your seed data thoroughly to ensure that database setup is smooth.

### API routes

Your API layer should be written in Express and connect to your SQL database using Knex. It should include these routes.

| HTTP method | path | description |
|-------------|------|-------------|
| `GET` | `/tasks` | returns an array of all tasks; any task that is assigned to a `household_member` embeds that household member's information in the response data |
| `GET` | `/tasks/:id` | returns a single task; any task that is assigned to a `household_member` embeds that household member's information in the response data |
| `POST` | `/tasks` | creates a new task |
| `PUT` | `/tasks/:id` | updates a task; if that task becomes completed and is recurring, automatically generates the next iteration of that task |
| `DELETE` | `/tasks/:id` | deletes a task, and any assignment for that task |
| `GET` | `/household_members` | returns an array of all household members |
| `GET` | `/household_members/:id` | returns a single household member, including an array of all tasks currently assigned to them |
| `POST` | `/household_members` | creates a new household member |
| `DELETE` | `/household_members/:id` | deletes a household member, and unassigns any tasks currently assigned to them |
| `POST` | `/tasks/:id/assign/:member_id` | assigns a task to a household member |

### Front end application

Your application should be written in React and should make requests to your API. It should have these screens.

| path | screen title | description |
|------|--------------|-------------|
| `/` | Home | shows all tasks due today, ordered by who they’re assigned to |
| `/tasks` | All Tasks | Shows all incomplete tasks, ordered by due date; a button allows showing completed tasks instead |
| `/tasks/:id` | Task detail | Shows details of a single task; allows assigning that task to a user or navigating to the edit page, as well as marking the task completed |
| `/tasks/:id/edit` | Task edit | Allows editing the details of a task |
| `/tasks/new` | Create task | Allows creating a new task; by default, it will not be assigned to any user |
| `/profiles` | Household Members | Shows a list of all household members |
| `/profiles/:id` | Member page | Displays the user profile for a single household member, including their complete and incomplete tasks |
| `/profiles/new` | Create household member | A form to create a new household member |
| `/profiles/:id/edit` | Edit household member | A form to edit an existing household member |

## User Stories

### US-01 Household Member Management
As a household member<br/>
I want to create new household members<br/>
so that I can assign tasks to my different household members.

#### Acceptance Criteria

* The `/profiles` page shows a list of all household members.
    * This will require the `/household_members` API route(s) to function correctly.
    * Each displayed household member contains a link to their individual profile page.
* The `/profiles/new` page displays a form that creates a new household member and redirects back to the `/profiles` page on submit.
* The `/profiles/:id` page displays information about a single household member.
* The `/profiles/:id/edit` page allows editing information about a single household member.

### US-02 Task Management
As a household member <br/>
I want to see a list of tasks <br/>
so that I can keep track of the current tasks in my household.

#### Acceptance Criteria
* The `/tasks` page shows all incomplete tasks, sorted by date
* The `/tasks/new` page allows creating a new task
* The `/tasks/:id` page allows viewing a single task
* The `/tasks/:id/edit` page allows editing a single task

### US-03 Assigning Tasks to Users
As a household member <br/>
I want to assign my tasks to different household members<br/>
so that I can keep track of who is reponsible for which tasks.

#### Acceptance Criteria
* The `/tasks` page should display a dropdown next to each task for selecting which household member that task is assigned to.
    * The dropdown should, when the page loads, show the household member currently assigned to that task, or `None` if no household member is currently assigned
    * Choosing a new household member or `None` in the dropdown should update who that task is assigned to

### US-04 Viewing Tasks By Household Member
As a household member <br/>
I want to view only the tasks assigned to me <br/>
so I can work on my tasks.

#### Acceptance Criteria

* The `/profiles/:id` page should display a list of the tasks currently assigned to that user.

### US-05 Completing Tasks
As a household member<br/>
I want to mark tasks complete<br/>
so that I can track what I need to accomplish.

#### Acceptance Criteria

* On the `/tasks` page and the `/tasks/:id` page, there should be a button to mark a task as complete.
    * Each page should also display whether the task is completed or not.

### US-06 Tracking Completed Tasks
As a household member<br/>
I want to see the list of tasks filtered by their completion status<br/>
so that I can track what the household needs to accomplish.

#### Acceptance Criteria

* The `/tasks` page should show only incompleted tasks by default and contain filter options to show completed tasks or all tasks.

### US-07 Recurring Tasks
As a household member <br/>
I want to create and maintain recurring tasks<br/>
so I can more easily track tasks which must happen repeatedly.

#### Acceptance Criteria

* The `/tasks/:id` page should show whether a task is recurring, and, if so, how often it recurs (in days).
* When a recurring task is completed, one new task should be generated with a due date X days in the future, where X is how often the task recurs.
    * This new task should, by default, be assigned to the same household member as the previous task.
    * This new task should also be recurring with the same frequency.
    * This new task should start out incomplete.
    * The previous task should also still exist, and should be marked complete.
* If a user changes a task from recurring to not-recurring, then completing that task should not generate any new task.

## Recommended Schedule

| Time frame | Goals |
|------------|------|
| Week 1, Mon-Tues | Go through the final capstone lessons. Understand the final capstone requirements. Plan out your project, creating a Kanban board and schedule for your final capstone project. Deploy your application. Design the schema and pages for your household members. |
| Week 1, Wed-Fri | Complete the first user story. |
| Week 2, Mon-Wed | Re-deploy your application. Complete the second and third user stories. |
| Week 2, Thurs-Fri | Complete the fourth and fifth user stories. Re-deploy your application. |
| Week 3, Mon-Wed | Complete any remaining users stories. Re-deploy your application. |
| Week 3, Thurs-Fri | Complete your README file and clean up your code. Submit your project. |

## Rubric

When your final capstone project is graded, your grader will use the above acceptance criteria and this rubric to assess your work.

1. Are all the tests passing?
2. Are all business rules enforced in UI, API, and (if possible) the database?
3. Do all API calls make use of an AbortController?
4. Do all API calls abort without error in the UI or console (e.g. click a submit button multiple times very quickly)?
5. Do all API calls in React handle errors and display the error message to the user?
6. Do all uses of key= in React loops use a unique value from the entity (key is never the array index)?
7. Are all functions calls using async/await wrapped in a valid asyncErrorBoundary or try/catch block?
8. Note two things that the student could improve upon.
9. Note two things that the student did well.

Your grader may leave additional feedback on your submission once it's reviewed.