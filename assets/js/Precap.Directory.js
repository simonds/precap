var Precap = Precap || {};

Precap.Directory = new Class({

	Implements: [Options,Events]

	,options: {
		
	}

	,initialize: function(options){
		this.setOptions(options);
	}

	,_build: function(){
		// <div class="Directory HideMe">
		// 	<div class="Header">
		// 		<div class="PrecapButton Size-Icon Enabled CloseX_L"><span>X</span></div>

		// 		<div class="SearchInput">
		// 			<div class="Icon">&#160;</div>
		// 			<input type="Text" placeholder="Search"/>
		// 		</div>

		// 		<div class="DirectoryActionButtons">
		// 			<div class="PrecapButton Size-Icon Enabled AddButton_S"><span>+</span></div>
		// 		</div>
		// 	</div>

		// 	<div class="DirectoryListView">
		// 		<ul class="DirectoryTabIndex">
		// 			<li>A</li>
		// 			<li>B</li>
		// 			<li class="Active">C</li>
		// 			<li>D</li>
		// 			<li>E</li>
		// 			<li>F</li>
		// 			<li>G</li>
		// 			<li>H</li>
		// 			<li>I</li>
		// 			<li>J</li>
		// 			<li>K</li>
		// 			<li>L</li>
		// 			<li>M</li>
		// 			<li>N</li>
		// 			<li>O</li>
		// 			<li>P</li>
		// 			<li>Q</li>
		// 			<li>R</li>
		// 			<li>S</li>
		// 			<li>T</li>
		// 			<li>U</li>
		// 			<li>V</li>
		// 			<li>W</li>
		// 			<li>X</li>
		// 			<li>Y</li>
		// 			<li>Z</li>
		// 		</ul>
		// 		<ul class="DirectoryList">
		// 			<li id="hcard-Albert-Harrison" class="vcard Contact Person DirectoryListItem" title="View this contact card...">
		// 				<div class="Avatar">&#160;</div>							
		// 				<span class="Name fn n">Albert Harrison</span>
		// 				<span class="Title">producer</span>
		// 				<span class="Email"><a class="email" href="mailto:albert@hiscompany.com?Subject=Re: [Precap Name] - ">albert@hiscompany.com</a></span>
		// 				<span class="Phone tel">212-123-1234</span>
		// 			</li>
		// 			<li id="hcard-Olivia-Colbert" class="vcard Contact Person DirectoryListItem" title="View this contact card...">
		// 				<div class="Avatar">&#160;</div>							
		// 				<span class="Name fn n">Olivia Colbert</span>
		// 				<span class="Title">stylist</span>
		// 				<span class="Email"><a class="email" href="mailto:o.email@colbertstyleinc.com?Subject=Re: [Precap Name] - ">o.email@colbertstyleinc</a></span>
		// 				<span class="Phone tel">212-123-1234</span>
		// 			</li>
		// 			<li id="hcard-Josh-Patrick" class="vcard Contact Person DirectoryListItem" title="View this contact card...">
		// 				<div class="Avatar">&#160;</div>							
		// 				<span class="Name fn n">Josh Patrick</span>
		// 				<span class="Title">assistant</span>
		// 				<span class="Email"><a class="email" href="mailto:joshassists@yahoo.com?Subject=Re: [Precap Name] - ">joshassists@yahoo.com</a></span>
		// 				<span class="Phone tel">212-123-1234</span>
		// 			</li>
		// 			<li id="hcard-Michael-Hieronymus" class="vcard Contact Person DirectoryListItem" title="View this contact card...">
		// 				<div class="Avatar">&#160;</div>							
		// 				<span class="Name fn n">Michael Hieronymus</span>
		// 				<span class="Title">make-up artist</span>
		// 				<span class="Email"><a class="email" href="mailto:michaelhieronymus@michaeldoesmakeup.com?Subject=Re: [Precap Name] - ">michaelhieronymus@michaeldoesmakeup.com</a></span>
		// 				<span class="Phone tel">212-123-1234</span>
		// 			</li>
		// 			<li id="hcard-ABC-Rentals" class="vcard Contact Organization DirectoryListItem" title="View this contact card...">
		// 				<div class="Avatar">&#160;</div>							
		// 				<span class="Name fn org">ABC Rentals</span>
		// 				<span class="PrimaryContact">Jonathan Thompson</span>
		// 				<span class="Email"><a class="email" href="mailto:JonathanThompson@abcrentals.com?Subject=Re: [Precap Name] - ">JonathanThompson@abcrentals.com</a></span>
		// 				<span class="Phone tel">212-123-1234</span>
		// 			</li>
		// 			<!--  -->
		// 			<li id="hcard-Olivia-Colbert" class="vcard Contact Person DirectoryListItem" title="View this contact card...">
		// 				<div class="Avatar">&#160;</div>							
		// 				<span class="Name fn n">Olivia Colbert</span>
		// 				<span class="Title">stylist</span>
		// 				<span class="Email"><a class="email" href="mailto:o.email@colbertstyleinc.com?Subject=Re: [Precap Name] - ">o.email@colbertstyleinc</a></span>
		// 				<span class="Phone tel">212-123-1234</span>
		// 			</li>
		// 			<li id="hcard-Josh-Patrick" class="vcard Contact Person DirectoryListItem" title="View this contact card...">
		// 				<div class="Avatar">&#160;</div>							
		// 				<span class="Name fn n">Josh Patrick</span>
		// 				<span class="Title">assistant</span>
		// 				<span class="Email"><a class="email" href="mailto:joshassists@yahoo.com?Subject=Re: [Precap Name] - ">joshassists@yahoo.com</a></span>
		// 				<span class="Phone tel">212-123-1234</span>
		// 			</li>
		// 			<li id="hcard-Michael-Hieronymus" class="vcard Contact Person DirectoryListItem" title="View this contact card...">
		// 				<div class="Avatar">&#160;</div>							
		// 				<span class="Name fn n">Michael Hieronymus</span>
		// 				<span class="Title">make-up artist</span>
		// 				<span class="Email"><a class="email" href="mailto:michaelhieronymus@michaeldoesmakeup.com?Subject=Re: [Precap Name] - ">michaelhieronymus@michaeldoesmakeup.com</a></span>
		// 				<span class="Phone tel">212-123-1234</span>
		// 			</li>
		// 			<li id="hcard-ABC-Rentals" class="vcard Contact Organization DirectoryListItem" title="View this contact card...">
		// 				<div class="Avatar">&#160;</div>							
		// 				<span class="Name fn org">ABC Rentals</span>
		// 				<span class="PrimaryContact">Jonathan Thompson</span>
		// 				<span class="Email"><a class="email" href="mailto:JonathanThompson@abcrentals.com?Subject=Re: [Precap Name] - ">JonathanThompson@abcrentals.com</a></span>
		// 				<span class="Phone tel">212-123-1234</span>
		// 			</li>
		// 		</ul>
		// 	</div>

		// 	<div class="ContactCardView HideMe">
		// 		<!-- ContactCard -->
		// 		<div class="ContactCard Vertical" id="hcard-Olivia-Colbert-12345">
		// 			<div class="PrecapButton Size-Icon Enabled BackBracket"><span><</span></div>
		// 			<div class="Avatar">&#160;</div>
		// 			<h1 class="Name">Olivia Colbert</h1>

		// 			<!-- 'view' version -->
		// 			<ul class="ContactDetails">
		// 				<li>
		// 					<label>title</label>
		// 					<span class="Value">stylist</span>
		// 				</li>
		// 				<li>
		// 					<label>company</label>
		// 					<span class="Value">Colbert Style Inc.</span>
		// 				</li>
		// 				<li>
		// 					<label>phone</label>
		// 					<span class="Value Phone tel">212-123-1234</span>
		// 				</li>
		// 				<li>
		// 					<label>email</label>
		// 					<span class="Value Email"><a class="email" href="mailto:o.email@colbertstyleinc.com?Subject=Re: [Precap Name] - ">o.email@colbertstyleinc.com</a></span>
		// 				</li>
		// 				<li>
		// 					<label>web</label>
		// 					<span class="Value Website">colbertstyleinc.com</span>
		// 				</li>
		// 				<li>
		// 					<label>twitter</label>
		// 					<span class="Value Twitter">@colbertstyle</span>
		// 				</li>
		// 			</ul>

		// 			<div class="ActionButtons">
		// 				<div class="PrecapButton Size-Medium Enabled Download"><span>Download</span></div>
		// 				<div class="PrecapButton Size-Medium Enabled Edit"><span>Edit</span></div>
		// 			</div>
		// 		</div>
		// 		<!-- /ContactCard -->
		// 	</div>
		// </div>
		// <!-- /Directory Menu -->
	}
});