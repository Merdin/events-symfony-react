<?php

namespace App\DataFixtures;

use App\Enum\Roles;
use App\Factory\EventFactory;
use App\Factory\UserFactory;
use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    const EMAIL = [
        'admin' => 'admin@test.com',
        'employee' => 'employee@test.com',
        'user' => 'user@test.com',
    ];

    public function load(ObjectManager $manager): void
    {
        $event = EventFactory::createOne([
            'title' => 'Event with participants',
        ]);

        $admin = UserFactory::createOne([
            'email' => self::EMAIL['admin'],
            'roles' => [Roles::ROLE_ADMIN->value],
        ]);

        $employee = UserFactory::createOne([
            'email' => self::EMAIL['employee'],
            'roles' => [Roles::ROLE_EMPLOYEE->value],
        ]);

        UserFactory::createOne([
            'email' => self::EMAIL['user'],
        ]);

        $event->addParticipant($admin);
        $event->addParticipant($employee);

        EventFactory::createMany(5, [
            'title' => 'Event in the past',
            'starts_at' => CarbonImmutable::now()->subMonth(),
        ]);
        EventFactory::createMany(5, [
            'title' => 'Joinable event in the future',
            'starts_at' => CarbonImmutable::now()->addMonth(),
        ]);

        $manager->flush();
    }
}
