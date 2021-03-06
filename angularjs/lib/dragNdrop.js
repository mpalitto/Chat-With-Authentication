mainApp.directive('draggable', function() {
    return function(scope, element) {
        // this gives us the native JS object
        var el = element[0];

        el.draggable = true;

        el.addEventListener(
            'dragstart',
            function(e) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('Text', this.id);
                this.classList.add('drag');
                return false;
            },
            false
        );

        el.addEventListener(
            'dragend',
            function(e) {
                this.classList.remove('drag');
                return false;
            },
            false
        );
    }
});

mainApp.directive('droppable', function() {
    return {
        scope: {
            drop: '&', // parent
            bin: '=' // bi-directional scope
        },
        link: function(scope, element) {
            var el = element[0];

            el.addEventListener(
                'dragover',
                function(e) {
                    e.dataTransfer.dropEffect = 'move';
                    // allows us to drop
                    if (e.preventDefault) e.preventDefault();
                    this.classList.add('over');
                    this.classList.add('selected');
                    return false;
                },
                false
            );
            
            el.addEventListener(
                'dragenter',
                function(e) {
                    this.classList.add('over');
                    this.classList.add('selected');
                    return false;
                },
                false
            );
            
            el.addEventListener(
                'dragleave',
                function(e) {
                    this.classList.remove('over');
                    this.classList.remove('selected');
                    return false;
                },
                false
            );

            el.addEventListener(
                'drop',
                function(e) {
                    // Stops some browsers from redirecting.
                    e.preventDefault();
                    if (e.stopPropagation) e.stopPropagation();

                    this.classList.remove('over');
                    this.classList.remove('selected');

                    var binId = this.id;
                    //console.log(e.dataTransfer);
                    var item = document.getElementById(e.dataTransfer.getData('Text'));
                    console.log('item: '+item+' bin: '+binId);
                    console.log(item);
                    //this.appendChild(item);
                    // call the passed drop function
                    scope.$apply(function(scope) {
                        var fn = scope.drop();
                        if ('undefined' !== typeof fn) {
                          fn(item.id, binId);
                        }
                    });

                    return false;
                },
                false
            );
        }
    }
});
