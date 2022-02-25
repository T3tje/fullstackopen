describe("Blog app", function() {
   beforeEach(function() {
      cy.request("POST", "http://localhost:3001/api/testing/reset")
      const user = {
         name: "Tilman",
         username: "mrm1ster",
         password: "test-pw"
      }

      cy.request("POST", "http://localhost:3001/api/users/", user)
      cy.visit("http://localhost:3000")
   })

   it("displays the loginForm", function() {
      cy.get("#loginForm").contains("login")
   })

   describe("Login", function() {

      it("succeds with correct credentials", function() {
         cy.get("#username").type("mrm1ster")
         cy.get("#password").type("test-pw")
         cy.get("#loginButton").click()
         cy.contains("Tilman is logged in")
         cy.get(".success").should("contain", "succesfully logged in")
            .and("have.css", "color", "rgb(0, 128, 0)")
      })

      it("succeds with wrong credentials",function() {
         cy.get("#username").type("mrm1ster")
         cy.get("#password").type("wrong-pw")
         cy.get("#loginButton").click()
         cy.get(".error").should("contain", "login failed")
            .and("have.css", "color", "rgb(255, 0, 0)")
      })
   })

   describe("when logged in", function() {
      beforeEach(function(){
         cy.request("POST", "http://localhost:3001/api/login", {
            username: "mrm1ster", password: "test-pw"
         }).then(function(response) {
            localStorage.setItem("loggedBlogUser", JSON.stringify(response.body))
         })
         cy.visit("http://localhost:3000")
         cy.contains("new blog").click()
         cy.get("#titleInput").type("a blog created by cypress")
         cy.get("#authorInput").type("bymyself")
         cy.get("#urlInput").type("www.com")
         cy.get("#createButton").click()
      })

      it("A blog can be created", function() {
         cy.contains("a blog created by cypress")
      })

      it("users can like a blog", function() {

         cy.get("#viewbutton").click()
         cy.contains("Likes: 0")
         cy.contains("like").click()
         cy.contains("Likes: 1")
      })

      it("A blog can be deleted by the user who created it", function() {
         cy.get("#viewbutton").click()
         cy.contains("delete").click()
         cy.get("html").should("not.contain", "a blog created by cypress")
      })

      describe("Blogs are ordered..", function() {

         beforeEach(function() {

            const blog1 = {
               title: "test 1",
               author: "mrmr",
               url: "www.com",
               likes: 7,
            }

            const blog2 = {
               title: "test 2",
               author: "mrmrmr",
               url: "www.com",
               likes: 1,
            }

            const blog3 = {
               title: "test 3",
               author: "mrmr",
               url: "www.com",
               likes: 27,
            }

            cy.request({
               url: "http://localhost:3001/api/blogs",
               method: "POST",
               body: blog1,
               headers: {
                  "Authorization": `bearer ${JSON.parse(localStorage.getItem("loggedBlogUser")).token}`
               }
            })

            cy.request({
               url: "http://localhost:3001/api/blogs",
               method: "POST",
               body: blog2,
               headers: {
                  "Authorization": `bearer ${JSON.parse(localStorage.getItem("loggedBlogUser")).token}`
               }
            })

            cy.request({
               url: "http://localhost:3001/api/blogs",
               method: "POST",
               body: blog3,
               headers: {
                  "Authorization": `bearer ${JSON.parse(localStorage.getItem("loggedBlogUser")).token}`
               }
            })
         })

         it("by the amount of likes", function() {
            cy.visit("http://localhost:3000")
            cy.get(".view").click({ multiple: true })


            cy.get(".likes")
               .then(likes => {

                  let valueBefore = likes[0].textContent

                  for(let i = 1; i < likes.length; i += 1) {
                     if(Number(valueBefore) < Number(likes[i].textContent))
                        throw new Error()

                     valueBefore = likes[i].textContent
                  }
               })

         })
      })
   })
})