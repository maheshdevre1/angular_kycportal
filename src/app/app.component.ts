import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SidenavService } from './services/sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  // used to control the overlay sidebar and template
  isSidenavOpen = false;

  // layout visibility flags (template should use these)
  showNavbar = true;
  showSidebar = true;
  showFooter = true;

  // convenience: true when none of the hide flags are set
  get showLayout(): boolean {
    return this.showNavbar && this.showSidebar && this.showFooter;
  }

  private sidenavSub!: Subscription;
  private routeSub!: Subscription;

  constructor(
    private sidenav: SidenavService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // keep local isSidenavOpen in sync with the SidenavService
    this.sidenavSub = this.sidenav.open$.subscribe(v => this.isSidenavOpen = v);

    // Apply route data for the current route immediately (fixes initial load)
    const initialSnapshot = this.getDeepestRoute(this.activatedRoute.snapshot);
    this.applyRouteData(initialSnapshot);

    // React to subsequent navigation end events
    this.routeSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getDeepestRoute(this.activatedRoute.snapshot))
    ).subscribe((snapshot: ActivatedRouteSnapshot) => {
      this.applyRouteData(snapshot);
    });
  }

  /**
   * Close the sidebar via the service (used by overlay click)
   */
  closeSidebar(): void {
    this.sidenav.close();
  }

  /**
   * Read route snapshot data and apply visibility flags.
   * Uses bracket notation because route.data is an index signature.
   */
  private applyRouteData(snapshot: ActivatedRouteSnapshot): void {
    const data = snapshot.data || {};

    this.showNavbar  = !(data['hideNavbar'] === true);
    this.showSidebar = !(data['hideSidebar'] === true);
    this.showFooter  = !(data['hideFooter'] === true);

    // If route requests hiding the sidebar, ensure it is closed
    if (!this.showSidebar && this.isSidenavOpen) {
      this.sidenav.close();
    }
  }

  /**
   * Walk down to the deepest activated route snapshot so child route data is respected.
   */
  private getDeepestRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  ngOnDestroy(): void {
    if (this.sidenavSub) this.sidenavSub.unsubscribe();
    if (this.routeSub) this.routeSub.unsubscribe();
  }
}
