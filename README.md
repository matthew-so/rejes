# rejes
A research-paper display system powered by express.js and pug/jade

userinfo.db: Contains all information regarding users, including the IP address of the user and a sequential list of actions taken by ID. 
When initially accessing the webpage, a new entry containing the IP address of the user and a blank list are stored into the SQLite database. 
In addition, when the “view research paper” button is clicked underneath each of the three columns of research abstracts, the ID of the clicked paper is appended to the list. 
As a result, userinfo.db can be accessed from tools such as SQLiteBrowser.

index.js: Contains all processing for SQLite; the list of actions associated with a user can be accessed through the variable “actionstaken”. 

papers.xml: Contains information regarding each research paper, such as an ID (used during processing), Name, Abstract, and Data (a link to the pdf containing the research paper). 

arxivconverter.exe: Accepts a list of line-separated arXiv IDs in txt format as input and outputs XML for use in Rejes.
Input as follows: arxivconverter.exe <input.txt> [(optional) <output (sans .xml)>].
