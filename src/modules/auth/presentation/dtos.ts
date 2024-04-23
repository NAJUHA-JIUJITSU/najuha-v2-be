import e from 'express';
import {
  AcquireAdminRoleParam,
  AcquireAdminRoleRet,
  RefreshTokenParam,
  RefreshTokenRet,
  SnsLoginParam,
  SnsLoginRet,
} from '../application/dtos';

// Presentation Layer Request DTOs --------------------------------------------
export interface SnsLoginReqBody extends SnsLoginParam {}

export interface RefreshTokenReqBody extends RefreshTokenParam {}

// Presentation Layer Response DTOs -------------------------------------------
export interface SnsLoginRes extends SnsLoginRet {}

export interface RefreshTokenRes extends RefreshTokenRet {}

export interface AcquireAdminRoleRes extends AcquireAdminRoleRet {}
