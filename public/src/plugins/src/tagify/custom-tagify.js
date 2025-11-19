var inputElm = $('#users-list-tags');

    function tagTemplate(tagData){
        return `
            <tag title="${tagData.email}"
                    contenteditable='false'
                    spellcheck='false'
                    tabIndex="-1"
                    class="tagify__tag ${tagData.class ? tagData.class : ""}"
                    ${this.getAttributes(tagData)}>
                <x title='' class='tagify__tag__removeBtn' role='button' aria-label='remove tag'></x>
                <div>
                    <div class='tagify__tag__avatar-wrap'>
                        <img onerror="this.style.visibility='hidden'" src="${tagData.avatar}">
                    </div>
                    <span class='tagify__tag-text'>${tagData.name}</span>
                </div>
            </tag>
        `;
    }

    function suggestionItemTemplate(tagData){
        return `
            <div ${this.getAttributes(tagData)}
                class='tagify__dropdown__item ${tagData.class ? tagData.class : ""}'
                tabindex="0"
                role="option">
                ${ tagData.avatar ? `
                <div class='tagify__dropdown__item__avatar-wrap'>
                    <img onerror="this.style.visibility='hidden'" src="${tagData.avatar}">
                </div>` : ''
                }
                <strong>${tagData.name}</strong>
                <span>${tagData.email}</span>
            </div>
        `;
    }

    // Function to initialize Tagify
    function initializeTagify() {
        var usrList = new Tagify(inputElm[0], {
            tagTextProp: 'name',
            enforceWhitelist: true,
            skipInvalid: true,
            dropdown: {
                closeOnSelect: false,
                enabled: 0,
                classname: 'users-list',
                searchKeys: ['name', 'email']
            },
            templates: {
                tag: tagTemplate,
                dropdownItem: suggestionItemTemplate
            },
            whitelist: [
                {
                    "value": 1,
                    "name": "Justinian Hattersley",
                    "avatar": "https://i.pravatar.cc/80?img=1",
                    "email": "jhattersley0@ucsd.edu"
                },
                {
                    "value": 2,
                    "name": "Riswan",
                    "avatar": "https://i.pravatar.cc/80?img=1",
                    "email": "jhattersley0@ucsd.edu"
                },
                {
                    "value": 3,
                    "name": "Arlan",
                    "avatar": "https://i.pravatar.cc/80?img=1",
                    "email": "jhattersley0@ucsd.edu"
                },
                //...
            ]
        });

        usrList.on('dropdown:show dropdown:updated', onDropdownShow);
        usrList.on('dropdown:select', onSelectSuggestion);

        var addAllSuggestionsElm;

        function onDropdownShow(e){
            var dropdownContentElm = e.detail.tagify.DOM.dropdown.content;

            if( usrList.suggestedListItems.length > 1 ){
                addAllSuggestionsElm = getAddAllSuggestionsElm();

                // insert "addAllSuggestionsElm" as the first element in the suggestions list
                dropdownContentElm.insertBefore(addAllSuggestionsElm, dropdownContentElm.firstChild);
            }
        }

        function onSelectSuggestion(e){
            if( e.detail.elm == addAllSuggestionsElm )
                usrList.dropdown.selectAll();
        }

        // create a "add all" custom suggestion element every time the dropdown changes
        function getAddAllSuggestionsElm(){
            // suggestions items should be based on "dropdownItem" template
            return usrList.parseTemplate('dropdownItem', [{
                    class: "addAll",
                    name: "Add all",
                    email: usrList.whitelist.reduce(function(remainingSuggestions, item){
                        return usrList.isTagDuplicate(item.value) ? remainingSuggestions : remainingSuggestions + 1;
                    }, 0) + " Members"
                }]
              );
        }
    }

    $(document).ready(function() {
        $('#tabs-add-product').on('shown.bs.modal', function () {
            console.log('test');
            initializeTagify();
        });
    });
