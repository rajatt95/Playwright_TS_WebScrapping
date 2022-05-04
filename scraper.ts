/**************************************************/

/**  
* @author Rajat Verma
* https://www.linkedin.com/in/rajat-v-3b0685128/
* https://github.com/rajatt95
* https://rajatt95.github.io/ 
*  
* Course: Automated Software Testing with Playwright (https://www.udemy.com/course/automated-software-testing-with-playwright/)
* Tutor: Kaniel Outis (https://www.udemy.com/user/shinoku911/)
*/

/**************************************************/

// console.log('Hello, Test Automation Engineer!')

const playwright = require('playwright')
const random_useragent = require('random-useragent')
const fs = require('fs')

const BASE_URL = 'https://github.com/topics/playwright'

;(async() =>{
    // Create random User agent
    const agent = random_useragent.getRandom()

    // Setup Browser
    const browser = await playwright.chromium.launch({headless: false})
    //const context = await browser.newContext()
    const context = await browser.newContext({ userAgent: agent}) 
    const page = await context.newPage({ bypassCSP: true })

    await page.setDefaultTimeout(30000)

    // Set the dimension of Browser
    await page.setViewportSize({ width:800, height:600 })

    // Go to the application
    await page.goto(BASE_URL)

    // Get Data from website
    const repositories = await page.$$eval("article.border", (repoCards)=>{

        return repoCards.map((card)=>{
            const [user, repo] = card.querySelectorAll("h3 a")

            const formatText = (element) => element && element.innerText.trim()

            return{
                user: formatText(user),
                repo: formatText(repo),
                url: repo.href
                
            }
        })

    })

    console.log(repositories)

    // Store Data into File
    // flag: 'w' -> Means write
    const logger = fs.createWriteStream("data.txt",{ flag: 'w' })
    //logger.write(JSON.stringify(repositories)) // Not getting good format for data.txt file
    logger.write(JSON.stringify(repositories, null, ' '))

    //console.log(agent)

    // Close Browser
    await browser.close()

})().catch(error =>{
    console.log(error)

    // This is to exit the process in case any error comes
    process.exit(1)
})