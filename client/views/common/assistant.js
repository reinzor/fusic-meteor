Template.assistant.events = {
  'click #assistantIcon': function (e) {
  	$("#assistantIcon").removeClass("red");
  }
}

Template.assistant.rendered = function()
{
	// Reactive function which monitors number transition in the playlist of the current user
	Deps.autorun(function() {
		var playlistIndex = Session.get("playlistIndex");
		var playlist = Session.get("playlist");
		
		if (playlistIndex !== undefined && playlist != undefined)
		{
			var songs_left = playlist.songs.length - playlistIndex;
			var num_songs_warning = 2;

			// Give m some time to start
			if (playlist.songs.length < num_songs_warning + 1)
				return;

			if (songs_left == 0)
				assistant.addRandomSongToPlaylist();
			else if (songs_left < num_songs_warning + 1)
				assistant.warningXSongsLeft(songs_left);				
		}
	});
}

assistant = {
	last_say : new Date(),
	minimal_timeout : 10000,

	say : function(text) 
	{
		console.log("Assistant: \"" + text + "\"")

		var msg = new SpeechSynthesisUtterance();
		// var voices = window.speechSynthesis.getVoices();
		// msg.voice = voices[10]; // Note: some voices don't support altering params
		// msg.voiceURI = 'native';
		// msg.volume = 1; // 0 to 1
		// msg.rate = 1; // 0.1 to 10
		// msg.pitch = 2; //0 to 2
		msg.text = text;
		msg.lang = 'en-US';

		var now = new Date();
		if (now - this.last_say > this.minimal_timeout)
			speechSynthesis.speak(msg);

		$("#assistant").append(
		    $('<li>').append(
		        $('<a>').append(text)
		)); 

		var msgs = $("#assistant li");
		if (msgs.length > 5)
			msgs[0].remove();

		$("#assistantIcon").addClass("red");

		this.last = now;
  	},

  	warningXSongsLeft : function(x)
  	{
  		if (x > 1)
  			this.say("Please add some new songs to the playlist, there are only " + x + " songs left.");
  		else
  			this.say("Please add some new songs to the playlist, there is only " + x + " song left.");
  	},

  	addRandomSongToPlaylist : function()
  	{
  		this.say("No more songs in the playlist, I will add a random new one :)!");
  		this.say("Just kidding, this is not yet implemented.");
  	}
}
