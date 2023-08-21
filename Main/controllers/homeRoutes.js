const router = require("express").Router();
const Sequelize = require("sequelize");
const { Project, User, Ticket, Collaborator } = require("../models");
const withAuth = require("../utils/auth");
const dayjs = require("dayjs")

// Takes you to the homepage
router.get("/", async (req, res) => {
  try {
    console.log("last logged: " + dayjs(req.session.last_logged, 'MM/DD/YYYY'))

    res.render("homepage", {
      user_name: req.session.user_name,
      logged_in: req.session.logged_in,
      last_logged: req.session.last_logged,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Fly you fools. Server Error");
  }
});

// Takes you to the about page
router.get("/about", async (req, res) => {
  try {
    res.render("about", {
      user_name: req.session.user_name,
      logged_in: req.session.logged_in,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Fly you fools. Server Error");
  }
});

// Takes you to the login page
router.get("/login", async (req, res) => {
  try {
    res.render("login", {
      user_name: req.session.user_name,
      logged_in: req.session.logged_in,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Fly you fools. Server Error");
  }
});

// Takes you to the signup page
router.get("/signup", async (req, res) => {
  try {
    res.render("signup", {
      user_name: req.session.user_name,
      logged_in: req.session.logged_in,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Fly you fools. Server Error");
  }
});

// takes you to the logout page after you logout
router.get("/logout", async (req, res) => {
  try {
    res.render("logout");
  } catch (error) {
    res.status(500).send("Fly you fools. Server Error");
  }
});

router.get("/boards", async (req, res) => {
  try {
    const collaboratorData = await Collaborator.findAll({
      where: {
        user_id: req.session.user_id,
      },
      include: [
        {
          model: Project,
        },
      ],
    });

    // Get all projects that the user is a collaborator on
    const projectData = collaboratorData.map((collaborator) =>
      collaborator.get({ plain: true })
    );

    const projects = projectData.map((project) => project.project);


    res.render("boards_landing", {
      projects,
      user_id: req.session.user_id,
      user_name: req.session.user_name,
      logged_in: req.session.logged_in,
      last_logged: req.session.last_logged,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Fly you fools. Server Error");
  }
});

router.get("/boards/:id", withAuth, async (req, res) => {
  try {
    const projectData = await Project.findAll({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Ticket,
          include: {
            model: User, // Include the User model for creator_id
            attributes: ["first_name", "last_name"],
          },
        },
      ],
    });

    const last_logged = dayjs(req.session.last_logged).unix();

    const projects = projectData.map((project) => project.get({ plain: true }));

    // get all collaborators for this project
    const collaboratorData = await Collaborator.findAll({
      where: {
        project_id: req.params.id,
      },
      include: [
        {
          model: User,
          attributes: ["first_name", "last_name"],
        },
      ],
    });

    const collaborators = collaboratorData.map((collaborator) => collaborator.get({ plain: true }));

    console.log('____________________________________________')
    console.log(collaborators)
    console.log('____________________________________________')
    
    console.log("collaborators: " + JSON.stringify(collaborators, null, 2));


    let ticketsArray = [];

    for (let i = 0; i < projects.length; i++) {
      projects[i].todo = [];
      projects[i].doing = [];
      projects[i].review = [];
      projects[i].done = [];
      
      
      ticketsArray = projects[i].tickets.length
        ? projects[i].tickets.length
        : 0;
      for (let j = 0; j < ticketsArray; j++) {
        projects[i].tickets[j].isOwner = true;
        const date_created = dayjs(projects[i].tickets[j].date_created).unix()
        if (date_created > last_logged) {
          projects[i].tickets[j].new_item = true;
        } else {
          projects[i].tickets[j].new_item = false;
        }
        if (projects[i].tickets[j].status === "todo") {
          projects[i].todo.push(projects[i].tickets[j]);
        } else if (projects[i].tickets[j].status === "doing") {
          projects[i].doing.push(projects[i].tickets[j]);
        } else if (projects[i].tickets[j].status === "review") {
          projects[i].review.push(projects[i].tickets[j]);
        } else if (projects[i].tickets[j].status === "done") {
          projects[i].done.push(projects[i].tickets[j]);
        }
      }
    }


    const progress_data = Math.round((projects[0].done.length / ticketsArray) * 100)

    projects[0].progress_data = progress_data


    const now = dayjs();

    req.session.save(() => {
      req.session.last_logged = now;
    })

    console.log("Session user_name: " + req.session.user_name);
    console.log("Collaborator: ");

    res.render("boards", {
      projects,
      collaborators,
      progress_data,
      user_id: req.session.user_id,
      user_name: req.session.user_name,
      logged_in: req.session.logged_in,
      last_logged: req.session.last_logged,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Fly you fools. Server Error");
  }
});

router.get("/client", async (req, res) => {
  try {
    res.render("homepage", {
      user_name: req.session.user_name,
      logged_in: req.session.logged_in,
      last_logged: req.session.last_logged,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Fly you fools. Server Error");
  }
});

module.exports = router;
