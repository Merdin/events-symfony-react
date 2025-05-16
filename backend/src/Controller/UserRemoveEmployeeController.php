<?php

namespace App\Controller;

use App\Enum\Roles;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UserRemoveEmployeeController
{
    public function __invoke(
        int $user_id,
        UserRepository $userRepository,
        EntityManagerInterface $em,
        SerializerInterface $serializer
    )
    {
        $user = $userRepository->find($user_id);
        if (!$user) {
            throw new NotFoundHttpException('User not found');
        }

        $roles = $user->getRoles();

        $filteredRoles = array_filter($roles, function ($role) {
            return $role !== Roles::ROLE_EMPLOYEE->value;
        });
        $filteredRoles = array_values($filteredRoles);

        $user->setRoles($filteredRoles);
        $em->persist($user);
        $em->flush();

        return new JsonResponse(['status' => 'User is now an employee']);
    }
}
