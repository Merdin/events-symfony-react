<?php

namespace App\Controller;

use App\Repository\EventRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AddParticipantToEventController
{
    public function __invoke(
        int $event_id,
        EventRepository $eventRepository,
        Security $security,
        EntityManagerInterface $entityManager,
    ): JsonResponse
    {
        $event = $eventRepository->find($event_id);
        if (!$event) {
            throw new NotFoundHttpException("Event not found");
        }

        $user = $security->getUser();
        if (!$user) {
            throw new NotFoundHttpException("User not found");
        }

        if ($event->hasReachedMaxParticipants()) {
            throw new BadRequestHttpException("Maximum participants reached.");
        }

        // todo: maybe check if the user already participated in this event

        $event->addParticipant($user);
        $entityManager->persist($event);
        $entityManager->flush();

        return new JsonResponse(['status' => 'Participant added to event']);
    }
}
