<?php

namespace App\Controller;

use App\Dto\UserRegistrationInput;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Serializer\SerializerInterface;

class UserRegistrationController
{
    public function __invoke(
        UserRegistrationInput       $data,
        UserRepository $userRepository,
        ValidatorInterface          $validator,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface      $em,
        SerializerInterface         $serializer
    ): JsonResponse
    {
        $errors = $validator->validate($data);

        if (count($errors) > 0) {
            return new JsonResponse(
                $serializer->serialize($errors, 'json'),
                JsonResponse::HTTP_BAD_REQUEST,
                ['Content-Type' => 'application/json']
            );
        }

        if ($userRepository->findOneByEmail($data->getEmail())) {
            return new JsonResponse(['status' => 'Email already exist']);
        }

        $user = new User();
        $user->setEmail($data->email);

        $hashedPassword = $passwordHasher->hashPassword($user, $data->password);
        $user->setPassword($hashedPassword);

        $em->persist($user);
        $em->flush();

        return new JsonResponse(['status' => 'User created'], JsonResponse::HTTP_CREATED);
    }
}
