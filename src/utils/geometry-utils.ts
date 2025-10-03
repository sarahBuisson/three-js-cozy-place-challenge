import { BufferGeometry, Box3, Vector3, BoxGeometry } from 'three'
import { SUBTRACTION, Brush, Evaluator } from 'three-bvh-csg'

/**
 * Soustrait une boîte d'une géométrie donnée
 * 
 * @param geometry - La géométrie source
 * @param heightPercentage - Pourcentage de la hauteur totale pour la boîte à soustraire (0-1)
 * @param heightPosition - Position verticale de la boîte en pourcentage de la hauteur totale (0-1)
 *                        0 = bas, 0.5 = milieu, 1 = haut
 * @returns Nouvelle géométrie avec la boîte soustraite
 * 
 * @example
 * // Soustraire une boîte de 30% de hauteur positionnée à 50% de hauteur
 * const newGeometry = subtractBoxFromGeometry(geometry, 0.3, 0.5)
 */
export function subtractBoxFromGeometry(
  geometry: BufferGeometry,
  heightPercentage: number,
  heightPosition: number
): BufferGeometry {
  // Calculer la bounding box de la géométrie

  const boundingBox = new Box3().setFromBufferAttribute(
      // @ts-ignore
    geometry.attributes.position
  )
  
  const size = new Vector3()
  boundingBox.getSize(size)
  
  const center = new Vector3()
  boundingBox.getCenter(center)
  
  // Calculer les dimensions de la boîte à soustraire
  const boxWidth = size.x+0.5
  const boxDepth = size.z+0.5
  const boxHeight = size.y * heightPercentage
  
  // Calculer la position Y de la boîte à soustraire
  const minY = boundingBox.min.y
  const maxY = boundingBox.max.y
  const boxCenterY = center.y+minY + (maxY - minY) * heightPosition
  
  // Créer la géométrie de la boîte à soustraire
  const boxGeometry = new BoxGeometry(boxWidth, boxHeight, boxDepth)
  
  // Créer les brushes pour l'opération CSG
  const sourceBrush = new Brush(geometry)
  const boxBrush = new Brush(boxGeometry)
  
  // Positionner la boîte à la hauteur spécifiée
  boxBrush.position.set(center.x, boxCenterY, center.z)
  boxBrush.updateMatrixWorld()
  
  // Effectuer l'opération de soustraction
  const evaluator = new Evaluator()
  const result = evaluator.evaluate(sourceBrush, boxBrush, SUBTRACTION)
  
  // Retourner la géométrie résultante
  return result.geometry
}

/**
 * Variante qui soustrait plusieurs boîtes à différentes hauteurs
 * 
 * @param geometry - La géométrie source
 * @param cuts - Tableau de découpes { heightPercentage, heightPosition }
 * @returns Nouvelle géométrie avec toutes les boîtes soustraites
 * 
 * @example
 * // Soustraire 3 boîtes à différentes hauteurs
 * const newGeometry = subtractMultipleBoxes(geometry, [
 *   { heightPercentage: 0.2, heightPosition: 0.2 },
 *   { heightPercentage: 0.2, heightPosition: 0.5 },
 *   { heightPercentage: 0.2, heightPosition: 0.8 }
 * ])
 */
export function subtractMultipleBoxes(
  geometry: BufferGeometry,
  cuts: Array<{ heightPercentage: number; heightPosition: number }>
): BufferGeometry {
  let resultGeometry = geometry.clone()
  
  for (const cut of cuts) {
    resultGeometry = subtractBoxFromGeometry(
      resultGeometry,
      cut.heightPercentage,
      cut.heightPosition
    )
  }
  
  return resultGeometry
}

/**
 * Soustrait une boîte avec des dimensions personnalisées
 * 
 * @param geometry - La géométrie source
 * @param boxWidth - Largeur de la boîte (facteur: 1 = largeur totale de la géométrie)
 * @param boxHeight - Hauteur de la boîte (facteur: 1 = hauteur totale de la géométrie)
 * @param boxDepth - Profondeur de la boîte (facteur: 1 = profondeur totale de la géométrie)
 * @param heightPosition - Position verticale (0-1, 0 = bas, 1 = haut)
 * @returns Nouvelle géométrie avec la boîte soustraite
 * 
 * @example
 * // Soustraire une boîte de 80% largeur, 30% hauteur, 60% profondeur au milieu
 * const newGeometry = subtractCustomBox(geometry, 0.8, 0.3, 0.6, 0.5)
 */
export function subtractCustomBox(
  geometry: BufferGeometry,
  boxWidth: number,
  boxHeight: number,
  boxDepth: number,
  heightPosition: number
): BufferGeometry {
  // Calculer la bounding box de la géométrie
  const boundingBox = new Box3().setFromBufferAttribute(
      // @ts-ignore
    geometry.attributes.position
  )
  
  const size = new Vector3()
  boundingBox.getSize(size)
  
  const center = new Vector3()
  boundingBox.getCenter(center)
  
  // Calculer les dimensions de la boîte à soustraire
  const actualBoxWidth = size.x * boxWidth
  const actualBoxHeight = size.y * boxHeight
  const actualBoxDepth = size.z * boxDepth
  
  // Calculer la position Y de la boîte à soustraire
  const minY = boundingBox.min.y
  const maxY = boundingBox.max.y
  const boxCenterY = minY + (maxY - minY) * heightPosition
  
  // Créer la géométrie de la boîte à soustraire
  const boxGeometry = new BoxGeometry(actualBoxWidth, actualBoxHeight, actualBoxDepth)
  
  // Créer les brushes pour l'opération CSG
  const sourceBrush = new Brush(geometry)
  const boxBrush = new Brush(boxGeometry)
  
  // Positionner la boîte
  boxBrush.position.set(center.x, boxCenterY, center.z)
  boxBrush.updateMatrixWorld()
  
  // Effectuer l'opération de soustraction
  const evaluator = new Evaluator()
  const result = evaluator.evaluate(sourceBrush, boxBrush, SUBTRACTION)
  
  // Retourner la géométrie résultante
  return result.geometry
}

/**
 * Utilitaire pour obtenir les informations de bounding box d'une géométrie
 * 
 * @param geometry - La géométrie à analyser
 * @returns Objet contenant size, center, min et max
 */
export function getGeometryBounds(geometry: BufferGeometry) {
  const boundingBox = new Box3().setFromBufferAttribute(
      // @ts-ignore
    geometry.attributes.position
  )
  
  const size = new Vector3()
  boundingBox.getSize(size)
  
  const center = new Vector3()
  boundingBox.getCenter(center)
  
  return {
    size,
    center,
    min: boundingBox.min.clone(),
    max: boundingBox.max.clone(),
    width: size.x,
    height: size.y,
    depth: size.z
  }
}
