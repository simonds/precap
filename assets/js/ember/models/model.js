DS.Model.reopen({
    lastCommitAt: null,
    saving: false,
    observeSaving: (function() {
        if (this.get('isSaving')) return this.set('saving', true);
    }).observes('isSaving'),
    observeDirty: (function() {
        if (this.get('saving') && !this.get('isDirty')) {
            this.set('saving', false);
            return this.set('lastCommitAt', new Date());
        }
    }).observes('isDirty')
});