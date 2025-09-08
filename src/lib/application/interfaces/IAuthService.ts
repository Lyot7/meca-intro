/**
 * Auth Service Interface - Application Layer
 * Définit le contrat pour les services d'authentification
 */

import type { Creator } from '../../domain/entities/Creator.js';

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	success: boolean;
	user?: Creator;
	error?: string;
}

export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
	description?: string;
	website?: string;
	socialMedia?: {
		instagram?: string;
		facebook?: string;
		twitter?: string;
	};
}

export interface RegisterResponse {
	success: boolean;
	user?: Creator;
	error?: string;
}

export interface IAuthService {
	login(request: LoginRequest): Promise<LoginResponse>;
	register(request: RegisterRequest): Promise<RegisterResponse>;
}
