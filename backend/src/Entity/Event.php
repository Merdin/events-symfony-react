<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Controller\AddParticipantToEventController;
use App\Controller\DeleteParticipantFromEventController;
use App\Repository\EventRepository;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: EventRepository::class)]
#[ApiResource(operations: [
    new Get(),
    new GetCollection(),
    new Post(),
    new Put(),
    new Delete(),

    // Participant endpoints
    new Post(
        uriTemplate: '/events/{event_id}/participate',
        controller: AddParticipantToEventController::class,
        description: 'Adds participant to the event',
        input: false,
        name: 'add_event_participant',
    ),
    new Delete(
        uriTemplate: '/events/{event_id}/participate',
        controller: DeleteParticipantFromEventController::class,
        description: 'Deletes participant from the event',
        name: 'delete_event_participant',
    ),
],
    normalizationContext: ['groups' => ['event:read']],
    denormalizationContext: ['groups' => ['event:write']],
)]
class Event
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column]
    #[Groups(['event:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank, Assert\Length(max: 255, maxMessage: 'Describe your event in less than 255 chars.')]
    #[Groups(['event:read', 'event:write'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Assert\NotBlank]
    #[Groups(['event:read', 'event:write'])]
    private ?string $description = null;

    #[ORM\Column(name: 'max_participants', nullable: true)]
    #[Groups(['event:read', 'event:write'])]
    private ?int $maxParticipants = null;
    /**
     * todo: think about the following scenario:
     *      An event is created with $maxParticipants = null ->
     *      and later the $maxParticipants is updated (to $maxParticipants > 0) ->
     *      but then the $maxParticipants count is lower than the amount of participants.
     *     What should we do in this case?
     */

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'events', cascade: ['persist'])]
    #[ORM\JoinTable(name: 'participants')]
    #[Groups('event:read')]
    private Collection $participants;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank, Assert\Length(max: 255, maxMessage: 'Describe the location in less than 255 chars.')]
    #[Groups(['event:read', 'event:write'])]
    private ?string $location = null;

    #[ORM\Column(name: 'starts_at')]
    #[Assert\NotNull]
    #[Groups(['event:read', 'event:write'])]
    private ?\DateTimeImmutable $startsAt = null; // todo: change format to Y-m-d H:i

    #[ORM\Column(name: 'created_at')]
    #[Assert\NotNull]
    #[Groups(['event:read'])]
    private ?\DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->participants = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setTextDescription(string $description): static
    {
        $this->description = nl2br($description);

        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(string $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function getStartsAt(): string
    {
        return $this->startsAt->format('Y-m-d H:i');
    }

    public function setStartsAt(\DateTimeImmutable $startsAt): static
    {
        $this->startsAt = $startsAt;

        return $this;
    }

    #[Groups(['event:read'])]
    public function getStartsIn(): string
    {
        return Carbon::instance($this->startsAt)->diffForHumans(Carbon::now(), [
            'parts' => 3,
            'short' => false,
            'syntax' => CarbonInterface::DIFF_RELATIVE_TO_NOW
        ]);
    }

    #[Groups(['event:read'])]
    public function isPast(): bool
    {
        return $this->startsAt < Carbon::now();
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    #[Groups(['event:read'])]
    public function getCreatedAtAgo(): string
    {
        return Carbon::instance($this->createdAt)->diffForHumans();
    }

    public function getParticipants(): Collection
    {
        return $this->participants;
    }

    public function getParticipantsCount(): int
    {
        return $this->participants->count();
    }

    public function hasParticipant(UserInterface $user): bool
    {
        return $this->participants->contains($user);
    }

    public function addParticipant(UserInterface $user): self
    {
        if (!$this->participants->contains($user)) {
            $this->participants->add($user);
            $user->addEvent($this);
        }

        return $this;
    }

    public function removeParticipant(UserInterface $user): self
    {
        if ($this->participants->removeElement($user)) {
            $user->removeEvent($this);
        }

        return $this;
    }

    public function getMaxParticipants(): ?int
    {
        return $this->maxParticipants;
    }

    #[Groups(['event:read'])]
    public function hasReachedMaxParticipants(): bool
    {
        if (!$this->getMaxParticipants()) return false;

        return $this->getParticipantsCount() >= $this->maxParticipants;
    }

    public function setMaxParticipants(?int $maxParticipants): static
    {
        $this->maxParticipants = $maxParticipants;
        return $this;
    }
}
