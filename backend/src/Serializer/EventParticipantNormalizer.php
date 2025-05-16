<?php

namespace App\Serializer;

use App\Entity\Event;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

class EventParticipantNormalizer implements NormalizerInterface
{
    private Security $security;
    private ObjectNormalizer $normalizer;
    public function __construct(
        ObjectNormalizer $normalizer,
        Security $security
    ) {
        $this->security = $security;
        $this->normalizer = $normalizer;
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof Event && (isset($context['resource_class']) && $context['resource_class'] === Event::class);
    }

    public function normalize(mixed $object, ?string $format = null, array $context = [])
    {
        // First get the normalized data
        $data = $this->normalizer->normalize($object, $format, $context);

        if (is_array($data)) {
            // Inject current user info
            $user = $this->security->getUser();
            $data['isParticipant'] = $user ? $object->hasParticipant($user) : false;
        }

        return $data;
    }
}
