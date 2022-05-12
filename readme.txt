
(1) Functionalities Implemented:
	
	- All functionalities are implemented

(2) Modifications / Additions to the requested functionalities
	
(3) Bonus Functionality Implemented - "Download" 
	
	- Explanation 			:	This functionality is shown after the user does
								the first request. When the first search is done 
								an extra green button appears. By pressing the 
								button an image of the html body is created AND 
								downloaded locally. 
		
	- Background Thinking		:	The idea is to share the data retrieved. For example
								the user could share the data retrieved with a friend
								via messanger/ facebook etc. Although, to implement that 
								more permissions were needed. So this solution was an 
								very good alternative. The user can download the data and 
								then share them in every way possible. 
	
	- JavaScript used			:	https://html2canvas.hertzen.com/dist/html2canvas.js
	
	- Complications			: 	After downloading the generated image it can be noticed that 
								some elements are missing. For example the icons, the map (if 
								the user pressed download while the "Right Now" tab was open)
								and also the background picture. 
								This is because, to retrive these information using the html2canvas
								function, some permission modifications should be made to all these 
								elements. 
								~	For example to retrive the image the attribute 
									' contributor = "Anonymus" ' should be stated. 
								~  	According to many articles this is not a good practise so
									I prefer not to change the permissions as it is considered 
									unsafe, and capture as many data as possible. 
									 
				
				 
	
	
