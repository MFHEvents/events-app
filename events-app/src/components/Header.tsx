import React, { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { PanelMenu } from 'primereact/panelmenu';
import { MenuItem } from 'primereact/menuitem';
import Link from 'next/link';
import LoginForm from "@/components/LoginForm";
import SignUpForm from './SignUpForm';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { Dialog } from 'primereact/dialog';

const Header = () => {
  const [visible, setVisible] = useState(false);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isSignUpModalVisible, setSignUpModalVisible] = useState(false);
  const {data: session, status} = useSession();

  const adminId = "6712dfc37e00f1ded8927a0b";

  // Check if the session is loading
  const sessionLoading = status === "loading";

  // console.log({session})

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
      icon: 'pi pi-fw pi-star',
      url: '/events',
      template: itemTemplate
    },
    {
      label: 'Calendar',
      icon: 'pi pi-fw pi-calendar',
      url: '/calendar',
      template: itemTemplate
    },

    //@ts-ignore
    ...(session?.user?.id === adminId ? [{
      label: 'Admin',
      icon: 'pi pi-fw pi-envelope',
      url: '/admin',
      template: itemTemplate
    }] : [])
  ];

  // Menubar start content (logo/text)
  const start = <span className="text-xl font-bold">MFH Events</span>;

  // Menubar end content (login/signup buttons)
  const end = !sessionLoading && (
    <div className="flex gap-4 items-center">
      {!session && <Button label="Log In" className="header-button" onClick={() => setLoginModalVisible(true)} />}
      {!session && <Button label="Sign Up" className="header-button-signup" onClick={() => setSignUpModalVisible(true)} />}
      {session && <Button label="Log out" className="header-button" onClick={() => signOut()} />}
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
        end={!sessionLoading && end}
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
      <Dialog header="Log In" visible={isLoginModalVisible} onHide={() => setLoginModalVisible(false)} style={{width: '35vw'}}>
        <LoginForm/>
      </Dialog>
      <Dialog header="Sign Up" visible={isSignUpModalVisible} onHide={() => setSignUpModalVisible(false)} style={{width: '35vw'}}>
        <SignUpForm/>
      </Dialog>
    </header>
  );
};

export default Header;
