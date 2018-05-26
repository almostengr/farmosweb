<?php
/**
 * @file
 * Control: Attribution.
 */

namespace Drupal\openlayers_library\Plugin\Control\OL3LayerSwitcher;

use Drupal\openlayers\Types\Control;
use Drupal\openlayers\Types\LayerInterface;
use Drupal\openlayers\Types\ObjectInterface;

/**
 * Class OL3LayerSwitcher.
 *
 * @OpenlayersPlugin(
 *  id = "OL3LayerSwitcher",
 *  description = ""
 * )
 */
class OL3LayerSwitcher extends Control {
  /**
   * {@inheritdoc}
   */
  public function optionsForm(array &$form, array &$form_state) {
    $form['options']['collapsible'] = array(
      '#type' => 'checkbox',
      '#title' => t('Collapsible'),
      '#default_value' => $this->getOption('collapsible'),
    );
  }

}
