<?php

namespace App\Enum;

enum Roles: string
{
    case ROLE_USER = 'ROLE_USER';
    case ROLE_EMPLOYEE = 'ROLE_EMPLOYEE';
    case ROLE_ADMIN = 'ROLE_ADMIN';
}
