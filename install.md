# IBGM Installation Guide
Welcome to the Instagram Bot Manager installation guide! This guide will help you step by step to install everything needed to run this program.<br><br>
Let's start!

## Steps
1. Install [Node.JS](https://nodejs.org/)
    - Follow the setup wizard and make sure to install NPM
    
2. Install [Github Desktop](https://desktop.github.com/) or [Git Bash](https://git-scm.com/downloads) & clone the repository
    - If you dediced to install **GitHub Desktop**, follow [this guide](https://docs.github.com/en/desktop/adding-and-cloning-repositories/cloning-and-forking-repositories-from-github-desktop#cloning-a-repository)
    - If you decided to install **Git Bash**, follow [this guide](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository#cloning-a-repository)
    
3. Create a [MongoDB](https://www.mongodb.com/) account
    1. Create an account using [this link](https://www.mongodb.com/cloud/atlas/register)
    2. Once your account is created get in the dashboard
    3. Once you are in your MongoDB dashboard, click on **Database** button under **DEPLOYMENT** section.<br> <img src="https://github.com/TommyQC/insta-bot-manager/assets/44536691/99d93b40-0925-41a5-bf3a-0b4a315a8fe2" width="100px">
    4. Click on the big green button in the center called `Build a Database`
    5. Choose the free option `M0` and choose your server provider and location, then click `Create`
    6. Setup a username and a password for your database and make sure to note it somewhere, then click `Create User`
    7. Click `Finish and Close` at the bottom of the page
    8. Now head back to the **Overview** tab and you should see your cluster
    9. Now click the `CONNECT` button on the cluster tab <br> <img src="https://github.com/TommyQC/insta-bot-manager/assets/44536691/62b82480-71ab-4684-aef8-f6a4cbddb2d5" width="300px">
    10. Choose the `Compass` option
    11. Add the database name after the `/`. For example, my connection string would look like this: `mongodb+srv://test_user:<password>@cluster0.2seunb3.mongodb.net/IBGM`, **IBGM** being the database name.
    12. Copy the connection string and paste it in the `config.js` file. Do not forget to replace ``<password>`` by the password of the user you just created for your database<br><br> For example, my connection string is `mongodb+srv://test_user:<password>@cluster0.2seunb3.mongodb.net/IBGM` so my config file would look like this ![image](https://github.com/TommyQC/insta-bot-manager/assets/44536691/e83cf682-0174-444d-b154-41652b5ebb4d)
  
4. Open the console by typing `CMD` in windows search
     - Run the command `node`<br>![image](https://github.com/TommyQC/insta-bot-manager/assets/44536691/c71c882c-7601-4e11-9654-8f1ce38351fa)
     - Then, run the command `require("crypto").randomBytes(35).toString("hex")`<br>![image](https://github.com/TommyQC/insta-bot-manager/assets/44536691/1265df4d-5ac1-4d76-8abf-11064ebd607e)
     - Copy this string and put it in `jwtSecret` field in the `config.js` file. Do not share this with anyone.
     - Now your config file should look like this: <br>![image](https://github.com/TommyQC/insta-bot-manager/assets/44536691/ca37f829-f847-4e7b-9473-eb5b43091923)

🎉 **Congratulation**, you have successfully installed and set-up everything for the project to work! To run the project, simply run `node index` in the command prompt.


