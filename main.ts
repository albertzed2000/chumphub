

const puppeteer = require("puppeteer")
const nodemailer = require("nodemailer")

const user = "peniszheng@gmail.com"
const password = "pcbrdeknmwofejed"

async function getLowestPrice(url){
    // gets the lowest price of concert from a stubhub webpage
    return new Promise(async function(resolve, reject){
        
            const browser = await puppeteer.launch({
                headless: true,
                args : [
                    "--disable-gpu",
                    "--disable-dev-shm-usage",
                    "--disable-set-uid-sandbox",
                    "no-sandbox",
                ]
            })

            const page = await browser.newPage();
            await page.goto(url, {
                waitUntil: 'networkidle2'
            })

            // let price = await page.$x('/html/body/div[1]/div/div[2]/div/div[1]/div/div[2]/div/div/div[1]/div/div/div[1]/div[2]/div[1]')
            let [price] = await page.$x('/html/body/div[1]/div/div[2]/div/div[3]/div/div/div[1]/div/div/div/div[2]/div[1]');
            let getMsg = await page.evaluate(name => name.innerText, price);
            getMsg = Number(getMsg.replace("C$", ""))
            // console.log(getMsg)
            browser.close()
            resolve(getMsg)
            // //*[@id="app"]/div/div[2]/div/div[1]/div/div[2]/div/div/div[1]/div/div/div[1]/div[2]/div[1]
            // /html/body/div[1]/div/div[2]/div/div[3]/div/div/div[1]/div/div/div/div[2]/div[1]
    })
}

function notifyBuyer(price, targetEmail, concert){
    const transporter = nodemailer.createTransport({
        service:'gmail',
        // port: 587,
        auth: {
           user: user,
           pass: password
        },
});
      
      var mailOptions = {
        from: user,
        to: targetEmail,
        subject: 'Price Notif: Concert tix for ' + concert + " @$" + String(price),
        text: "This shit bussin"
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

async function checkTargetPrice(url, target, email, concert){
    // check if price is good enough, email-notify if good enough
    return new Promise(async function(resolve, reject){
        let price = await getLowestPrice(url)
        console.log(price)

        if (Number(price) <= target){
            // notifyBuyer(price, email, concert)
        }

        resolve(price)
        // price = price.replace("$", "");

        // console.log(price)
    })
}
async function runApp(){
    let args = {}
    process.argv.forEach((val, index) => {
        args[index] = val
      });
    // console.log(args)
    
    await checkTargetPrice(args[2], args[3], args[4], args[5])
    return;
}
// node main.ts https://www.stubhub.ca/chase-atlantic-toronto-tickets-7-22-2022/event/105267766/ 70 mralbertzheng@gmail.com ChaseAtlantic
runApp()