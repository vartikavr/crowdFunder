# crowdFunder
A website for funding different listed campaigns while fixing the fundamental issue of accountability using the consensus protocol.
## Basic functionalities
- The website allows users to create new campaigns for funding.
- For each campaign, the listed details are- the address of the campaign, the wallet address of the manager of that campaign, minimum contribution, number of contributors, number of requests, and the campaign balance. 
- Any user can fund any campaign of their interest, by contributing more than the given minimum limit for that campaign.
- A new request is to be made by the manager, whenever the funds in the campaign are to be used.
- A request consists of a description, amount needed, wallet address of the recipient, and approval count.
- A request can only be finalized if it is approved by more than half of the number of contributors of that campaign.
- All the contributors of the campaign are eligible to approve the requests. Only a single vote (for approval) can be cast by a contributor for a particular request.
- The requests can only be finalized by the manager of the campaign. A request once finalized, transfers the corresponding amount to the recipient. 
- Thus, through the requests and voting mechanism, the fundamental issue of accountability is being resolved.
## Install dependencies
``` shell
$ npm install
```
## Run
``` shell
$ npm run dev
```
