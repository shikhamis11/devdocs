<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Setup\DataConverter;

use Magento\Framework\Exception\NoSuchEntityException;

/**
 * Load EAV data from an array of structural item data
 */
interface EavAttributeLoaderInterface
{
    /**
     * Hydrate PageBuilder data object with additional data from EAV
     *
     * @param int $entityId
     * @return array
     * @throws NoSuchEntityException
     */
    public function load($entityId);
}