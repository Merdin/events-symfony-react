<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Controller\UserMakeEmployeeController;
use App\Controller\UserRegistrationController;
use App\Controller\UserRemoveEmployeeController;
use App\Dto\UserRegistrationInput;
use App\Enum\Roles;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;


#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[UniqueEntity(fields: ['email'], message: 'Choose a different email address.')]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new Post(
            uriTemplate: '/users/{user_id}/roles/employee',
            controller: UserMakeEmployeeController::class,
            deserialize: true,
            validate: true,
            name: 'user_make_employee',
        ),
        new Delete(
            uriTemplate: '/users/{user_id}/roles/employee',
            controller: UserRemoveEmployeeController::class,
            name: 'user_remove_employee',
        ),
        new Post(
            uriTemplate: '/register',
            controller: UserRegistrationController::class,
            input: UserRegistrationInput::class,
            deserialize: true,
            name: 'register',
        ),
    ],
    normalizationContext: ['groups' => ['user:read'], ['event:read']],
    denormalizationContext: ['groups' => ['user:write']],
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read', 'event:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true, nullable: false)]
    #[Groups(['user:read', 'user:write', 'event:read'])]
    #[Assert\NotBlank]
    #[Assert\Email]
    private ?string $email = null;

    #[ORM\Column]
    #[Groups(['user:read'])]
    private array $roles = [];

    // todo: password field should hold the hashed password
    #[ORM\Column(nullable: false)]
    #[Groups(['user:write'])]
    private ?string $password = null;

    #[ORM\ManyToMany(targetEntity: Event::class, mappedBy: 'participants')]
    #[Groups(['user:read'])]
    private Collection $events;

    public function __construct()
    {
        $this->events = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string)$this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = Roles::ROLE_USER->value;

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getEvents(): Collection
    {
        return $this->events;
    }

    public function addEvent(Event $event): static
    {
        if (!$this->events->contains($event)) {
            $this->events->add($event);
        }

        return $this;
    }

    public function removeEvent(Event $event): static
    {
        if ($this->events->removeElement($event)) {
            $event->removeParticipant($this);
        }

        return $this;
    }
}
