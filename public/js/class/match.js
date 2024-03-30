// class for hinge matches
class Match {
    constructor(match, budImg, buddingImg, flower2img, flowerimg, witheringimg, witheredimg) {
      // this.id = match._id;
      this.x = mouseX//random(width - 50);
      this.y = mouseY//random(height);
      // this.w = random(50, 200);
      // this.h = random(50, 200);
      this.brightness = 0;
      this.size = random(90, 200);
      this.color = color(random(255), random(255), random(255));
     
      // Calculate responsive width for the flowers based on screen size
      let flowerSizeFactor = min(windowWidth, windowHeight) / 500; // Adjust this factor as needed
      this.minWidth = 100 * flowerSizeFactor; // Minimum width of the flower
      this.maxWidth = 200 * flowerSizeFactor; // Maximum width of the flower
      this.w = random(this.minWidth, this.maxWidth); // Random width within the specified range
      this.h = this.calculateHeight(this.w); // Calculate height based on width

      this.id = match._id;
      this.like = match.like || false //'no-like'//[];
      this.matched = match.match || false //'no-match'//[];
      this.block = match.block || false //[];
      this.chats = match.chats || false //'no-chats'//[];
      this.met = match.we_met || false
      this.myType = match.was_my_type || false
      this.text = "  ";
      this.state = "neutral"; // "sent like", "matched", 
      this.budImg = budImg;
      this.buddingImg = buddingImg;
      this.flower2img = flower2img;
      this.flowerimg = flowerimg;
      this.witheringimg = witheringimg;
      this.witheredimg = witheredimg;
      this.img; 
      this.chatIndex = 0;
      this.init();

      console.log(match);
    }

    logInfo() {
      let infoString = "";
      infoString += "like: " + this.like;
      infoString += " matched: " + this.matched;
      infoString += " chats: " + this.chats;
      infoString += " met: " + this.met;
  
      let blockType = "";
      for (let i = 0; i < this.block.length; i++) {
          blockType += this.block[i].block_type + ", ";
      }
      if (blockType !== "") {
          blockType = blockType.slice(0, -2); // Remove the last comma and space
      }
      infoString += "blocked: " + blockType + "\n";
      console.log(infoString)
      return infoString;
   }
  
    init() {
      console.log("NEW FLOWER");
     // this.logInfo();
      // console.log("init")
       if (this.like != false){
         this.state = "likeStart"
        //  this.text = this.logInfo();
           this.text = "send like " + this.like[0].timestamp; 
          // this.text += "_id:" + this.id + "\n send like"
         this.img = this.budImg;
       } else if (this.like === false && this.matched != false ) {
          this.state = "matched" 
          // this.text = this.logInfo();;
          //this.text = "match"; 
          this.text = "match " + this.matched[0].timestamp; 
          this.img = this.buddingImg;
       } else if (this.like === false &&  this.matched === false ){
          // this.state = "filter";
         this.state = "wither";
         //this.text = "no like no match ";
         this.text =  this.block[0].block_type + " "
         + this.block[0].timestamp
        // this.text += this.logInfo();
         //this.text = "like: " + this.like;
        this.img = this.budImg;
       }
    }

    calculateHeight(width) {
      // Introduce a random factor to the height
      let minHeightFactor = 0.5; // Adjust as needed
      let maxHeightFactor = 2.0; // Adjust as needed
      let randomHeightFactor = random(minHeightFactor, maxHeightFactor);
      return width * randomHeightFactor; // Height is based on the width and random factor
  }
  
    //on mouse click
    changeState() {
      // I SENT A LIKE
      if (this.state === "likeStart"){
        if (this.matched != false){ /// THEY LIKED ME! WE MATCH 
          this.state = "matched";
           this.text = "matched "
           + this.matched[0].timestamp; 
         //this.text = this.info();
           this.img = this.buddingImg;
        } else if (this.matched === false){ /// THEY DIDN'T LIKE ME BACK
           this.state = "wither";
           this.text = "match = undefined"
          //  console.log(this.match)
          //  this.text = " ";
          // this.text += this.matched;
         // this.text = this.matched;
        }
      } 
  
      // WE MATCHED!
       else if (this.state === "matched"){
        if (this.chats === false){ //WE NEVER SPEAK WITH EACHOTHER
          // console.log("no chats");
          this.state = "wither"
          this.text = "never spoke"
          
      } else {  // WE CHIT-CHAT  
        this.state = "chatting"
      }
    }
      else if ( this.state === "chatting"){
        if (this.chatIndex < this.chats.length) {
          this.text = "";
          this.img = this.flowerimg;
          const body = this.chats[this.chatIndex].body;
          const time = this.chats[this.chatIndex].timestamp;
          this.text += time + " " + body;
          console.log("Chat index " + this.chatIndex);
          console.log("chat length " + this.chats.length);
          this.chatIndex += 1;
         // Check if it's the last chat message
        } else if (this.chatIndex === this.chats.length) {
          console.log("no more chats");
          this.state = "nomorechats";
            //check if the chat was removed
            if (this.block){
              this.state = "wither";
              this.text =  this.block[0].block_type + " "
              + this.block[0].timestamp
            } else {
              this.text = "we_met?";
            }
        }
      }
  
     // DID WE MEET? 
      else if (this.state === "nomorechats"){
      if (this.met === false){
        this.state = "wither"
        this.text = "did_meet_subject = No" //+ this.met.timestamp;
      } else {
        this.state = "we met"
        this.text = "did_meet_subject = Yes" + this.met[0].timestamp;
        this.img = this.flower2img;
      }
     }
     else if (this.state === "we met") {
      this.state = "wither";
     }
    }
  
    // contains(px, py) {
    //   let d = dist(px, py, this.x, this.y);
    //   if ((px>this.x) && (px<this.x+this.w) && (py>this.y) && (py<this.y+this.h)){
    //     return true
    //   } else {
    //     return false;
    //   }
    // }

    contains(px, py) {
      let rectX = constrain(this.x, 0, width - this.w);
      let rectY = constrain(this.y, 0, height - this.h);
      if (px >= rectX && px <= rectX + this.w && py >= rectY && py <= rectY + this.h) {
        return true;
      } else {
        return false;
      }
    }

    handleClick() {
      this.changeState();
    }
  
    handleHover() {
      this.changeColor(200);
    }
  
    handleHoverOutside() {
      this.changeColor(255);
    }
  
  
    changeColor(bright) {
       this.brightness = bright;
      //this.img = this.flowerimg;
    }
  
    // end of the hinge match lifecycle
    wither(){
    if (this.text != "no like no match"){
      this.img = this.witheredimg;
    }
    
    this.size -= 0.5;
    this.w -= 0.5;
    this.h -= 0.5;
    if (this.w < 5) {
      this.state = "end";
      this.withered();
    }
    }
  
    withered() {
      if (this.state == "end"){
      return true;
      }
      }
  
    filter() {
      if (this.state == "filter"){
      //  this.size += 1;
      //  if (this.size > 100) {
        return true
      //  }
      }
    }
  

    display() {
      if (this.state == "wither"){
        this.wither();
      }
      push();
      stroke(this.color);
      strokeWeight(1);
      fill(this.brightness, 125);
     
      // rect(this.x, this.y, this.w, this.h)

       // Calculate the position and dimensions of the rectangle
      let rectX = constrain(this.x, 0, width - this.w); // Constrain x-coordinate within the screen width
      let rectY = constrain(this.y, 0, height - this.h); // Constrain y-coordinate within the screen height
      let rectW = min(this.w, width - rectX); // Limit width to fit within the screen
      let rectH = min(this.h, height - rectY); // Limit height to fit within the screen
  
      rect(rectX, rectY, rectW, rectH); // Draw the rectangle 


      noStroke();
      imageMode(CORNER);
      // Displays the image at point (0, height/2) at half size
      // image(this.img, this.x,this.y, this.w, this.h);
        // Calculate the position of the image based on the position of the rectangle
      let imgX = rectX;
      let imgY = rectY;
  
      // Adjust the image width and height if it overflows the rectangle
      let imgW = min(this.w, rectW);
      let imgH = min(this.h, rectH);
  
      image(this.img, imgX, imgY, imgW, imgH); // Draw the image

      fill(this.color);
      noStroke();
      textWrap(CHAR);
      // textAlign(CENTER);
      text(this.text, rectX, rectY, rectW, rectH); // Draw the text within the rectangle
      pop();
    }
  }