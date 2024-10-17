import React, { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { PanelMenu } from 'primereact/panelmenu';
import { MenuItem } from 'primereact/menuitem';
import Link from 'next/link';

const Header = () => {
  const [visible, setVisible] = useState(false);

  // Item template for better customization
  const itemTemplate = (item: MenuItem) => (
    <Link
      href={item.url || '/'}
      className="p-menuitem-link flex items-center"
      style={{ textDecoration: 'none' }}
    >
      <i className={item.icon}></i>
      <span className="ml-2">{item.label}</span>
    </Link>
  );

  const items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      url: '/',
      template: itemTemplate
    },
    {
      label: 'Events',
      icon: 'pi pi-fw pi-heart',
      url: '/events',
      template: itemTemplate
    },
    {
      label: 'Calendar',
      icon: 'pi pi-fw pi-calendar',
      url: '/calendar',
      template: itemTemplate
    },
    {
      label: 'Admin',
      icon: 'pi pi-fw pi-envelope',
      url: '/contact',
      template: itemTemplate
    }
  ];

  // Menubar start content (logo/text)
  const start = <span className="text-xl font-bold">MFH Events</span>;

  // Menubar end content (login/signup buttons)
  const end = (
    <div className="flex gap-4 items-center">
      <Button label="Log In" className="header-button" />
      <Button label="Sign Up" className="header-button-signup" />
      <Button
        icon="pi pi-bars"
        onClick={() => setVisible(true)}
        className="p-button-text lg:hidden"
        aria-label="Toggle Menu"
      />
    </div>
  );

  return (
    <header>
      {/* Fixed Menubar */}
      <Menubar
        model={items}
        start={start}
        end={end}
        className="top-0 left-0 right-0 w-full z-50 shadow-md px-10"
        style={{ backgroundColor: 'white' }}
      />
      {/* Sidebar for mobile menu */}
      <Sidebar
        visible={visible}
        onHide={() => setVisible(false)}
        className="w-full sm:w-20rem"
      >
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#003e75' }}>
          MFH Events
        </h2>
        <PanelMenu model={items} className="w-full md:w-25rem" />
        <div className="mt-4">
          <Button
            label="Log In"
            className="p-button-text mr-2 w-full"
            style={{ color: '#003e75' }}
          />
          <Button
            label="Sign Up"
            className="w-full"
            style={{ backgroundColor: '#003e75', border: 'none' }}
          />
        </div>
      </Sidebar>
    </header>
  );
};

export default Header;
