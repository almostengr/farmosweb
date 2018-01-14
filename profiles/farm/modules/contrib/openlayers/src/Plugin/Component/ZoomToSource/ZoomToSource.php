<?php
/**
 * @file
 * Component: ZoomSource.
 */

namespace Drupal\openlayers\Plugin\Component\ZoomToSource;

use Drupal\openlayers\Types\Component;

/**
 * Class ZoomToSource.
 *
 * @OpenlayersPlugin(
 *  id = "ZoomToSource"
 * )
 */
class ZoomToSource extends Component {

  /**
   * {@inheritdoc}
   */
  public function optionsForm(array &$form, array &$form_state) {
    $form['options']['source'] = array(
      '#type' => 'select',
      '#title' => t('Source'),
      '#empty_option' => t('- Select a Source -'),
      '#default_value' => isset($form_state['item']->options['source']) ? $form_state['item']->options['source'] : '',
      '#description' => t('Select the source.'),
      '#options' => \Drupal\openlayers\Openlayers::loadAllAsOptions('Source'),
      '#required' => TRUE,
      '#multiple' => TRUE,
    );

    $form['options']['zoom'] = array(
      '#type' => 'textfield',
      '#title' => t('Zoom'),
      '#default_value' => isset($form_state['item']->options['zoom']) ? $form_state['item']->options['zoom'] : 10,
      '#description' => t('Integer or <em>auto</em> or <em>disabled</em>.'),
      '#required' => TRUE,
    );
    $form['options']['max_zoom'] = array(
      '#type' => 'textfield',
      '#title' => t('Max Zoom'),
      '#default_value' => isset($form_state['item']->options['max_zoom']) ? $form_state['item']->options['max_zoom'] : 0,
      '#description' => t('Define the max zoom for the autozoom. Disabled when <em>0</em>.'),
      '#states' => array(
        'visible' => array(
          'input[name="options[zoom]"' => array('value' => 'auto'),
        ),
      ),
    );
    $form['options']['process_once'] = array(
      '#type' => 'checkbox',
      '#title' => t('Zoom just on map build'),
      '#default_value' => !empty($form_state['item']->options['process_once']),
      '#description' => t('If enabled the zoom to source only will fire once at map build. And ignore change events on the source.'),
    );

    $form['options']['duration'] = array(
      '#type' => 'textfield',
      '#title' => t('Animation duration'),
      '#default_value' => isset($form_state['item']->options['duration']) ? $form_state['item']->options['duration'] : '500',
      '#description' => t('Duration of the animation.'),
    );
  }
}
