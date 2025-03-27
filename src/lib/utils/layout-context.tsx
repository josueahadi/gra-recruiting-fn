"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";

interface LayoutContextType {
	isMobileMenuOpen: boolean;
	toggleMobileMenu: () => void;
	closeMobileMenu: () => void;
	openMobileMenu: () => void;
}

// Create the context with a default value
const LayoutContext = createContext<LayoutContextType>({
	isMobileMenuOpen: false,
	toggleMobileMenu: () => {},
	closeMobileMenu: () => {},
	openMobileMenu: () => {},
});

// Custom hook to use the layout context
export const useLayout = () => useContext(LayoutContext);

interface LayoutProviderProps {
	children: React.ReactNode;
}

/**
 * Provider component that wraps the app and provides layout state
 */
export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	const openMobileMenu = () => {
		setIsMobileMenuOpen(true);
	};

	return (
		<LayoutContext.Provider
			value={{
				isMobileMenuOpen,
				toggleMobileMenu,
				closeMobileMenu,
				openMobileMenu,
			}}
		>
			{children}
		</LayoutContext.Provider>
	);
};

export default LayoutProvider;
