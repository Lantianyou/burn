#[burn_tensor_testgen::testgen(flatten)]
mod tests {
    use super::*;
    use burn_tensor::{Data, Shape, Tensor};

    /// Test if the function can successfully flatten a 4D tensor to a 1D tensor.
    #[test]
    fn should_flatten_to_1d() {
        let tensor = Tensor::<TestBackend, 4>::ones(Shape::new([2, 3, 4, 5]));
        let flattened_tensor: Tensor<TestBackend, 1> = tensor.flatten(0, 3);
        let expected_shape = Shape::new([120]);
        assert_eq!(flattened_tensor.shape(), expected_shape);
    }

    /// Test if the function can successfully flatten the middle dimensions of a 4D tensor.
    #[test]
    fn should_flatten_middle() {
        let tensor = Tensor::<TestBackend, 4>::ones(Shape::new([2, 3, 4, 5]));
        let flattened_tensor: Tensor<TestBackend, 3> = tensor.flatten(1, 2);
        let expected_shape = Shape::new([2, 12, 5]);
        assert_eq!(flattened_tensor.shape(), expected_shape);
    }

    /// Test if the function can successfully flatten the first dimensions of a 4D tensor.
    #[test]
    fn should_flatten_begin() {
        let tensor = Tensor::<TestBackend, 4>::ones(Shape::new([2, 3, 4, 5]));
        let flattened_tensor: Tensor<TestBackend, 2> = tensor.flatten(0, 2);
        let expected_shape = Shape::new([24, 5]);
        assert_eq!(flattened_tensor.shape(), expected_shape);
    }

    /// Test if the function can successfully flatten the last dimensions of a 4D tensor.
    #[test]
    fn should_flatten_end() {
        let tensor = Tensor::<TestBackend, 4>::ones(Shape::new([2, 3, 4, 5]));
        let flattened_tensor: Tensor<TestBackend, 2> = tensor.flatten(1, 3);
        let expected_shape = Shape::new([2, 60]);
        assert_eq!(flattened_tensor.shape(), expected_shape);
    }

    /// Test if the function panics when the start dimension is greater than the end dimension.
    #[test]
    #[should_panic]
    fn should_flatten_panic() {
        let tensor = Tensor::<TestBackend, 4>::ones(Shape::new([2, 3, 4, 5]));
        let flattened_tensor: Tensor<TestBackend, 2> = tensor.flatten(2, 0);
    }
}
