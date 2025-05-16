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

class UserMakeEmployeeController
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

        if (!in_array(Roles::ROLE_EMPLOYEE->value, $roles)) {
            $roles[] = Roles::ROLE_EMPLOYEE->value;

            $user->setRoles($roles);
            $em->persist($user);
            $em->flush();
        }

        return new JsonResponse(['status' => 'User is an employee']);
    }
}
