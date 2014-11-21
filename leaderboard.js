PlayersList = new Mongo.Collection("players");

if(Meteor.isServer){
  console.log("Server Server Server");
	Meteor.publish('thePlayers', function(){
    var currentUserId = this.userId;
    return PlayersList.find({createdBy: currentUserId})
	});
	Meteor.methods({
		'insertPlayerData': function (playerName, playerScore){
			var currentUserId = Meteor.userId();
			PlayersList.insert({
				name: playerName,
				score: playerScore,
				createdBy: currentUserId
			})
		},
		'removePlayerData': function(player){
			PlayersList.remove(player);
		},
		'modifyPlayerScore': function(player, changeBy){
			console.log('player = ',player);
			console.log('modify by =', changeBy);
			PlayersList.update(player, {$inc: {score: changeBy} });
			console.log(PlayersList.find().fetch());
			
		}
	})
};

if(Meteor.isClient){
  console.log("Client Client Clinet");
	Meteor.subscribe('thePlayers');
	

  
  Template.leaderboard.helpers({
    'player': function(){
			//var currentUserId = Meteor.userId();
			return PlayersList.find({}, {sort: {score: -1, name: 1}})
    },
    'selectedClass': function(){
      var playerId= this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if(playerId == selectedPlayer){
        return "selected"
      }
      //return this._id
			//return "selected"name:
    },
    'playerCount': function(){
        return PlayersList.find().count()
    },
    'picked': function(){
      return Session.get('picked')
    },
		'showSelectedPlayer': function(){
			var selectedPlayer = Session.get('selectedPlayer')
			return PlayersList.findOne(selectedPlayer)
		}
    
  });
  
  Template.leaderboard.events({
    'click .player': function(){
        console.log("You clicked an li element");
        var playerId = this._id;
        Session.set('selectedPlayer', playerId);
        var selectedPlayer=Session.get('selectedPlayer');
        console.log(selectedPlayer);     
    },
		'click .increment': function(){
			var selectedPlayer = Session.get('selectedPlayer');
				//	console.log(selectedPlayer);
			//PlayersList.update(selectedPlayer, {$inc: {score: 5} });
			Meteor.call('modifyPlayerScore', selectedPlayer, 5);
		},
		'click .decrement': function(){
			var selectedPlayer = Session.get('selectedPlayer');
				//	console.log(selectedPlayer);
			//PlayersList.update(selectedPlayer, {$inc: {score: -5} });
			Meteor.call('modifyPlayerScore', selectedPlayer, -5);
		},
    'focus #form1': function() {
      console.log("focus focus");
      myinput1.style.backgroundColor = "yellow";
    },
    'blur #form1': function() {
      console.log("blur blur blur");
      myinput1.style.backgroundColor = "";
    },
    'mouseover #form2': function() {
      myinput2.style.backgroundColor = "red";
    },
    'mouseout #form2': function() {
       myinput2.style.backgroundColor = "";
    },
    'change #myselect': function() {
       var x = myselect.value;
       console.log('xxxxx');
       demo.innerHTML = "You selected: " + x;
       demo.style.backgroundColor = "red";
      Session.set('picked', x);
    },
		'click .remove': function(){
    var selectedPlayer = Session.get('selectedPlayer');
    Meteor.call('removePlayerData', selectedPlayer)
}
  });
  
	Template.addPlayerForm.events({
		'submit form': function(){
			event.preventDefault();
			//console.log("Form submitted");
			//console.log(event.type);
			var playerNameVar = event.target.playerName.value;
			var playerScoreVar = parseInt(event.target.playerScore.value);
			console.log(playerNameVar);
			console.log(playerScoreVar);
			//var currentUserId = Meteor.userId();
			Meteor.call('insertPlayerData', playerNameVar, playerScoreVar);
			
			/*PlayersList.insert({
				name: playerNameVar,
				score: playerScoreVar,
				createdBy : currentUserId
				});
				*/
		  //console.log(event.target.playerName.value);
			event.target.playerName.value = "";
			event.target.playerScore.value = "";
			//console.log(event.target.playerName.value);
			 addPersonName.style.backgroundColor = "";
			addPersonScore.style.backgroundColor = "";
			
	},
		 'focus #addPerson': function() {
      console.log("focus focus");
      addPersonName.style.backgroundColor = "yellow";
			addPersonScore.style.backgroundColor = "red" 
    },
    'blur #addPerson': function() {
      console.log("blur blur blur");
      addPersonName.style.backgroundColor = "";
			addPersonScore.style.backgroundColor = "" 
    },
	});
}