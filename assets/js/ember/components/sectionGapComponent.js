App.SectionGapComponent = Ember.Component.extend( {
    layoutName: 'components/section-gap'
    ,classNames: 'SectionGap'
    ,tagName: 'div'
    ,_showAddSectionHere: function() {
        this.$('.AddSectionHereButton').fadeOut(140);
        this.$('.AddSectionHereBar').css({
            display: 'block'
            ,opacity: 0
        }).animate({
            width: '100%'
            ,opacity: 1
        }, 160, 'easeOutExpo');
    }
    ,_hideAddSectionHere: function() {
        this.$('.AddSectionHereBar').animate({
            opacity: 0
            ,width: 0
        }, 160, 'easeOutExpo', function(){ $(this).hide(); });
        this.$('.AddSectionHereButton').fadeIn(240);
    }
    ,actions: {
        showAddSectionHere: function() {
            this._showAddSectionHere();
        }
        ,hideAddSectionHere: function() {
            this._hideAddSectionHere();
        }
        ,createNoteSection: function() {
            this.get('targetObject').send('createSection', 'Note', this.get('position'));
            this._hideAddSectionHere();
        }
        ,createListSection: function() {
            this.get('targetObject').send('createSection', 'List', this.get('position'));
            this._hideAddSectionHere();
        }
        ,createLocationSection: function() {
            this.get('targetObject').send('createSection', 'Location', this.get('position'));
            this._hideAddSectionHere();
        }
        ,createTimelineSection: function() {
            this.get('targetObject').send('createSection', 'Timeline', this.get('position'));
            this._hideAddSectionHere();
        }
        ,createGroupSection: function() {
            this.get('targetObject').send('createSection', 'Group', this.get('position'));
            this._hideAddSectionHere();
        }
        ,createPhotosetSection: function() {
            this.get('targetObject').send('createSection', 'Photoset', this.get('position'));
            this._hideAddSectionHere();
        }
        ,createFilesetSection: function() {
            this.get('targetObject').send('createSection', 'Fileset', this.get('position'));
            this._hideAddSectionHere();
        }
    }
});