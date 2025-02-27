/**
 * @author Jörn Kreutel
 */
import {mwf} from "vfh-iam-mwf-base";
import {mwfUtils} from "vfh-iam-mwf-base";
import * as entities from "../model/MyEntities.js";
import {GenericCRUDImplLocal} from "vfh-iam-mwf-base";
// import {MediaItem, MyEntity} from "../model/MyEntities.js";

export default class ListviewViewController extends mwf.ViewController {

    // instance attributes set by mwf after instantiation
    args;
    root;
    // TODO-REPEATED: declare custom instance attributes for this controller
    crudops;
    items;
    addNewMediaItemElement;

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        // TODO: do databinding, set listeners, initialise the view
        this.addNewMediaItemElement = this.root.querySelector("#myapp-addNewMediaItem");
        this.addNewMediaItemElement.onclick = () => {

            // const srcOptions = ["https://picsum.photos/75/125","https://picsum.photos/125/175","https://picsum.photos/125/75"];
            // const titleOptions = ["lorem","ipsum","dolor"];
            // const selectedSrc= srcOptions[Date.now() % srcOptions.length];
            // const selectedTitle= titleOptions[Date.now() % titleOptions.length];
            // const newMediaItem = new entities.MediaItem(selectedTitle,selectedSrc);
            // newMediaItem.create().then(() => this.addToListview(newMediaItem));
            // this.nextView("myapp-mediaEditview");
            this.createNewItem();
        };

        // this.items = items;
        entities.MediaItem.readAll().then(items => {
            if (items.length > 0) {
                const firstItemFromList = items[0];
            }
            this.initialiseListview(items)
        });
        // this.initialiseListview(this.items);

        // call the superclass once creation is done
        super.oncreate();
    }


    constructor() {
        super();

        console.log("ListviewViewController()");
        //  this.items = [
        //      new entities.MediaItem("lorem","https://picsum.photos/100/100"),
        //      new entities.MediaItem("ipsum","https://picsum.photos/200/150"),
        //      new entities.MediaItem("dolor","https://picsum.photos/100/300"),
        //      new entities.MediaItem("sit","https://picsum.photos/200/300")
        //  ];
        // this.crudops = GenericCRUDImplLocal.newInstance("MediaItem");

    }

    /*
     * for views that initiate transitions to other views
     * NOTE: return false if the view shall not be returned to, e.g. because we immediately want to display its previous view. Otherwise, do not return anything.
     */
    async onReturnFromNextView(nextviewid, returnValue, returnStatus) {
        // TODO: check from which view, and possibly with which status, we are returning, and handle returnValue accordingly
        if (returnStatus === "itemDeleted" && returnValue.item) {
            this.removeFromListview(returnValue.item._id);
        } else if (returnStatus === "itemCreated" && returnValue.item) {
            this.addToListview(returnValue.item);
        } else if (returnStatus === "itemUpdated" && returnValue.item) {
            this.updateInListview(returnValue.item._id, returnValue.item);
        }
    }

    /*
     * for views with listviews: bind a list item to an item view
     * TODO: delete if no listview is used or if databinding uses ractive templates
     */
    // bindListItemView(listviewid, itemview, itemobj) {
    //     // TODO: implement how attributes of itemobj shall be displayed in itemview
    //     // console.log("ListviewViewController(): ", itemview, itemobj);
    // //     itemview.root.querySelector("img").src = itemobj.src;
    // //     itemview.root.querySelector("h2").textContent =itemobj.title + " " + itemobj._id;
    // //     itemview.root.querySelector("h3").textContent =itemobj.added;
    //  }

    /*
     * for views with listviews: react to the selection of a listitem
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemSelected(itemobj, listviewid) {
        // TODO: implement how selection of itemobj shall be handled
        this.nextView("myapp-mediaReadview", {item: itemobj});
    }

    /*
     * for views with listviews: react to the selection of a listitem menu option
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemMenuItemSelected(menuitemview, itemobj, listview) {
        // TODO: implement how selection of the option menuitemview for itemobj shall be handled
        super.onListItemMenuItemSelected(menuitemview, itemobj, listview);
    }

    /*
     * for views with dialogs
     * TODO: delete if no dialogs are used or if generic controller for dialogs is employed
     */
    // bindDialog(dialogid, dialogview, dialogdataobj) {
    //     // call the supertype function
    //     super.bindDialog(dialogid, dialogview, dialogdataobj);
    //
    //     // TODO: implement action bindings for dialog, accessing dialog.root
    // }

    createNewItem() {
        var newItem = new entities.MediaItem("", "https://picsum.photos/100/100");
        this.showDialog("mediaItemDialog", {
            item: newItem,
            actionBindings: {
                submitForm: ((event) => {
                    event.original.preventDefault();
                    newItem.create().then(() => {
                        this.addToListview(newItem);
                    });
                    this.hideDialog();
                })
            }
        });
    }

    deleteItem(item) {
        item.delete().then(() => {
            this.removeFromListview(item._id)
        });
    }

    editItem(item) {
        this.showDialog("mediaItemDialog", {
            item: item,
            actionBindings: {
                submitForm: ((event) => {
                    event.original.preventDefault();
                    item.update().then(() => {
                        this.updateInListview(item._id, item);
                    })

                        this.hideDialog();
                }),
                deleteItem: ((event) => {
                    this.deleteItem(item);
                    this.hideDialog();
                })
            }
        });
    }
}

