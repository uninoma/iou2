import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class IouService {
  private basePath: string;
  public items: Observable<any[]>;
  public itemsList: AngularFireList<any> = null; //  list of objects
  public item: any = null; //   single object
  public total = 0;
  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService
  ) {
    this.basePath = "/iou/0";
    authService.afAuth.user.subscribe(res => {
      this.basePath = "/iou/0";
      if (res != null) {
        this.basePath = "/iou/" + res.uid;
        this.getItemsList();
        this.getItems();
      }else{
       
      }
        
        
    });

    console.log("iouService instents created");
  }

  getItems() {
    if (this.itemsList) {
      var itemsSnapshotSubscription = this.itemsList
        .snapshotChanges();
      this.items=itemsSnapshotSubscription
        .pipe(
          map(changes =>
            changes.map(
              c => 
              {
                return {key: c.payload.key, ...c.payload.val()}
              }
              )
          )
        );
        this.calcTotal();
    }
  }
  calcTotal() {
    this.items.subscribe(items => {
      this.total = 0;
      for (let item of items) {
        this.total = item.price * item.pcs + this.total;
      }
    });
  }

  getItemsList(): any {
    this.itemsList = this.db.list(this.basePath);
    console.log(this.itemsList);
    return this.itemsList;
  }

  getItem(key: string): any {
    const itemPath = `${this.basePath}/${key}`;
    this.item = this.db.object(itemPath);
    return this.item;
  }

  createItem(item: any): void {
    this.itemsList.push(item).catch(error => this.handleError(error));
  }

  // Update an existing post
  updateItem(key: string, value: any): void {
    this.itemsList.update(key, value).catch(error => this.handleError(error));
  }

  // Deletes a single post
  deleteItem(key: string): void {
    this.itemsList.remove(key).catch(error => this.handleError(error));
  }

  // Deletes the entire list of posts
  deleteAll(): void {
    this.itemsList.remove().catch(error => this.handleError(error));
  }

  // Default error handling for all actions
  private handleError(error) {
    console.log(error);
  }
}
export class Data {
  static total;
}
