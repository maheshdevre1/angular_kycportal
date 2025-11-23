import { Component, OnDestroy } from '@angular/core';
import { Router, RouteReuseStrategy } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnDestroy {
  isOpen = false;            // global sidebar state (driven by service)
  submenuOpen = false;       // <-- per-item submenu state
  submenuOpenLegal = false; 
  private sub: Subscription;

  constructor(private sidenav: SidenavService,
              private router : Router
  ) {
    this.sub = this.sidenav.open$.subscribe(v => this.isOpen = v);
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

  close() { this.sidenav.close(); }

  goTo(path: string) {
    if (path) {
      // navigate using router (uncomment and inject Router)
      // this.router.navigate([path]);
    }
    // optionally: close sidebar on mobile:
    // this.sidenav.close();
  }

  batches() {
     this.router.navigate(['/batches']);
  }


    
  

  // Toggle only the submenu — do NOT touch sidenav service
  toggleSubmenu(event: Event) {
    // prevent parent handlers and default link behavior
    event?.stopPropagation();
    event?.preventDefault();

    this.submenuOpen = !this.submenuOpen;
  }

   toggleSubmenuLegal(event: Event) {
    // prevent parent handlers and default link behavior
    event?.stopPropagation();
    event?.preventDefault();

    this.submenuOpenLegal = !this.submenuOpenLegal;
  }
}
